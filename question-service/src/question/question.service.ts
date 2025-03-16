import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { RpcException } from '@nestjs/microservices';
import { Answear } from 'src/answear/answear.entity';
import { QuestionInterface } from './interfaces/questionInterface.interface';
import { Vote } from 'src/vote/vote.entity';
import { NumberOfVotesInterface } from './interfaces/numberOfVotes.interface';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) { }

  async getQuestion(questionId: string): Promise<QuestionInterface> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
        relations: ['answears'],
      });

      if (!question) {
        throw new RpcException({ message: 'Question not found', status: HttpStatus.NOT_FOUND });
      }

      const voteCount = await this.getQuestionVoteCount(questionId);

      const answersWithVotes = await Promise.all(
        question.answears.map(async answear => {
          const answerVoteCount = await this.getAnswearVoteCount(answear.id);
          return {
            ...answear,
            nrOfPositiveVotes: answerVoteCount.nrOfPositiveVotes,
            nrOfNegativeVotes: answerVoteCount.nrOfNegativeVotes,
          };
        }),
      );

      const response: QuestionInterface = { ...question, nrOfnegativeVotes: voteCount.nrOfNegativeVotes, nrOfPositiveVotes: voteCount.nrOfPositiveVotes, answears: answersWithVotes }

      return response;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch questions",
      });
    }
  }

  async getAllQuestions(): Promise<QuestionInterface[]> {
    try {
      const questions = await this.questionRepository
        .createQueryBuilder('question')
        .leftJoin('question.answears', 'answear') // Join and select answers
        .select([
          'question.id',
          'question.content',
          'question.userId',
          'question.createdAt',
          'question.updatedAt',
          '(SELECT COUNT(*) FROM vote WHERE vote.questionId = question.id AND vote.isUpVote = 1) as nrOfPositiveVotes',
          '(SELECT COUNT(*) FROM vote WHERE vote.questionId = question.id AND vote.isUpVote = 0) as nrOfNegativeVotes',
          'COUNT(DISTINCT answear.id) as nrOfAnswers',
        ])
        .groupBy('question.id')
        .orderBy('nrOfPositiveVotes', 'DESC')
        .getRawMany();


      if (questions.length <= 0) {
        throw new RpcException({ message: 'we have no questions', status: HttpStatus.NOT_FOUND });
      }

      return questions.map(question => ({
        id: question.question_id,
        title: question.question_title,
        content: question.question_content,
        userId: question.question_userId,
        createdAt: question.question_createdAt,
        updatedAt: question.question_updatedAt,
        nrOfPositiveVotes: +question.nrOfPositiveVotes,
        nrOfNegativeVotes: +question.nrOfNegativeVotes,
        nrOfAnswers: +question.nrOfAnswers, // Include the number of answers
      }));
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Faield to fetch questions",
      });
    }
  }

  async createQuestion(data: QuestionInterface): Promise<QuestionInterface> {
    try {
      const newQuestion = this.questionRepository.create(data);
      const question = await this.questionRepository.save(newQuestion);
      return question;
    } catch (error) {
      console.error('Error in createQuestion:', error);
      throw new RpcException({ message: 'Failed to create question', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  private async getQuestionVoteCount(questionId: string): Promise<NumberOfVotesInterface> {
    const upvotes = await this.voteRepository.count({ where: { question: { id: questionId }, isUpVote: true } });
    const downvotes = await this.voteRepository.count({ where: { question: { id: questionId }, isUpVote: false } });
    return {
      nrOfPositiveVotes: upvotes,
      nrOfNegativeVotes: downvotes
    };
  }

  private async getAnswearVoteCount(answearId: string): Promise<NumberOfVotesInterface> {
    const upvotes = await this.voteRepository.count({ where: { answear: { id: answearId }, isUpVote: true } });
    const downvotes = await this.voteRepository.count({ where: { answear: { id: answearId }, isUpVote: false } });
    return {
      nrOfPositiveVotes: upvotes,
      nrOfNegativeVotes: downvotes
    };
  }

  public async getTotalNrQuestions(): Promise<number> {
    try {
      const result = await this.questionRepository.count();
      return result;
    } catch (error) {
      console.error('Error in get total questions:', error);
      throw new RpcException({ message: 'Failed to get total questions', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

  }

  public async getAvgQuestionPerUser(): Promise<number> {
    try {
      const result = await this.questionRepository
        .createQueryBuilder('question')
        .select('AVG(question_count)', 'average')
        .from(qb => {
          return qb.select('COUNT(*)', 'question_count')
            .from(Question, 'q')
            .groupBy('q.userId');
        }, 'avg_user_questions')
        .getRawOne();


      return +result.average;

    } catch (error) {
      console.error('Error in get avg votes:', error);
      throw new RpcException({ message: 'Failed to get avg votes', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }


}