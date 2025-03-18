import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answear } from './answear.entity';
import { RpcException } from '@nestjs/microservices';
import { Question } from '../question/question.entity';
import { AnswearInterface } from './interfaces/answearInterface.interface';

@Injectable()
export class AnswearService {
  constructor(
    @InjectRepository(Answear)
    private readonly answearRepository: Repository<Answear>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) { }

  async createAnswear(data: AnswearInterface): Promise<AnswearInterface> {
    try {
      const question = await this.questionRepository.findOne({ where: { id: data.questionId } });

      if (!question) {
        throw new RpcException({ message: 'Answear not found', status: HttpStatus.NOT_FOUND });
      }

      const newAnswer = this.answearRepository.create({ ...data, question: question });
      const answer = await this.answearRepository.save(newAnswer);

      return answer;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to create answear",
      });
    }
  }

  public async getTotalNrAnswears(): Promise<number> {

    try {
      const result = await this.answearRepository.count();
      return result;
    } catch (error) {
      console.error('Error in get total answears:', error);
      throw new RpcException({ message: 'Failed to get total answer', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

  }

  public async getAvgAnswearPerUser(): Promise<number> {
    try {
      const result = await this.answearRepository
        .createQueryBuilder('answear')
        .select('AVG(answear_count)', 'average')
        .from(qb => {
          return qb.select('COUNT(*)', 'answear_count')
            .from(Answear, 'a')
            .groupBy('a.userId');
        }, 'avg_user_answears')
        .getRawOne();


      return +result.average;

    } catch (error) {
      console.error('Error in get avg answear:', error);
      throw new RpcException({ message: 'Failed to get avg answear', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }
}