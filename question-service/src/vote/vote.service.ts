import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { RpcException } from '@nestjs/microservices';
import { Question } from '../question/question.entity';
import { Answear } from '../answear/answear.entity';
import { VoteInterface } from './interfaces/voteInterface.interface';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Vote)
        private readonly voteRepository: Repository<Vote>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answear)
        private readonly answearRepository: Repository<Answear>,
    ) { }

    async voteQuestion(data: VoteInterface): Promise<Vote> {
        try {
            const question = await this.questionRepository.findOne({ where: { id: data.questionId } });
            let vote;
            if (!question) {
                throw new RpcException({ message: 'Question not found', status: HttpStatus.NOT_FOUND });
            }

            const existingVote = await this.voteRepository.findOne({
                where: { userId: data.userId, question: { id: data.questionId } },
            });
            console.log("eisting", existingVote, data)
            if (existingVote) {
                existingVote.isUpVote = data.isUpVote;
                vote = await this.voteRepository.save(existingVote);
            } else {
                const newVote = this.voteRepository.create({ ...data, question: question });
                vote = await this.voteRepository.save(newVote);
            }

            await this.questionRepository.save(question);

            const result = await this.voteRepository.findOne({ where: { id: vote.id }, relations: { question: true } });

            if (!result)
                throw new RpcException({ message: 'Vote not found', status: HttpStatus.NOT_FOUND });

            return result

        } catch (error) {
            console.error('Error in voteQuestion:', error);
            throw new RpcException({ message: `Failed to vote question`, status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
    }

    async voteAnswear(data: VoteInterface): Promise<Vote> {
        try {
            console.log("Aici")
            const answer = await this.answearRepository.findOne({ where: { id: data.answearId } });
            console.log("Aici", answer)

            let vote;
            if (!answer) {
                throw new RpcException({ message: 'Answer not found', status: HttpStatus.NOT_FOUND });
            }

            const existingVote = await this.voteRepository.findOne({
                where: { userId: data.userId, answear: { id: answer.id } },
            });

            if (existingVote) {
                existingVote.isUpVote = data.isUpVote;
                vote = await this.voteRepository.save(existingVote);
            } else {
                const newVote = this.voteRepository.create({ ...data, answear: answer });
                vote = await this.voteRepository.save(newVote);
            }

            await this.answearRepository.save(answer);

            const result = await this.voteRepository.findOne({ where: { id: vote.id }, relations: { answear: true } });

            if (!result)
                throw new RpcException({ message: 'Vote not found', status: HttpStatus.NOT_FOUND });

            return result;

        } catch (error) {
            console.error('Error in voteAnswer:', error);
            throw new RpcException({ message: `Failed to vote answer`, status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
    }

    public async getTotalNrvotes(): Promise<number> {
        try {
            const result = await this.voteRepository.count();
            return result;
        } catch (error) {
            console.error('Error in get total votes:', error);
            throw new RpcException({ message: 'Failed to get total votes', status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
    }

    public async getAvgVotesPerUser(): Promise<number> {
        try {
            const result = await this.voteRepository
                .createQueryBuilder('vote')
                .select('AVG(vote_count)', 'average')
                .from(qb => {
                    return qb.select('COUNT(*)', 'vote_count')
                        .from(Vote, 'v')
                        .groupBy('v.userId');
                }, 'avg_user_votes')
                .getRawOne();


            return +result.average;

        } catch (error) {
            console.error('Error in get avg votes:', error);
            throw new RpcException({ message: 'Failed to get avg votes', status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
    }

    async getMostPopularDayOfWeek(): Promise<string> {
        try {
            const result = await this.voteRepository
                .createQueryBuilder('vote')
                .select("DAYNAME(vote.createdAt)", "day_name")
                .addSelect("COUNT(*)", "vote_count")
                .groupBy("day_name") 
                .orderBy("vote_count", "DESC") 
                .limit(1) 
                .getRawOne();

            if (!result) {
                throw new RpcException({ message: 'There are no votes', status: HttpStatus.BAD_REQUEST });
            }

            return result.day_name;
        } catch (error) {
            console.error('Error in get avg votes:', error);
            throw new RpcException({ message: 'Failed to get best day of the week', status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
    }


}