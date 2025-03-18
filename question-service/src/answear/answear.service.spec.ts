import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswearService } from './answear.service';
import { Answear } from './answear.entity';
import { Question } from '../question/question.entity';
import { Vote } from '../vote/vote.entity';  
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

describe('AnswearService', () => {
let module: TestingModule;
let service: AnswearService;
let answearRepository: Repository<Answear>;
let questionRepository: Repository<Question>;

beforeAll(async () => {
  module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [Answear, Question, Vote],  
        synchronize: true,
        dropSchema: true,
      }),
      TypeOrmModule.forFeature([Answear, Question]),
    ],
    providers: [AnswearService],
  }).compile();

  service = module.get<AnswearService>(AnswearService);
  answearRepository = module.get<Repository<Answear>>(getRepositoryToken(Answear));
  questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
});

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await answearRepository.clear();
        await questionRepository.clear();
    });

    describe('createAnswear', () => {
        let testQuestion: Question;

        beforeEach(async () => {
            testQuestion = await questionRepository.save(
                questionRepository.create({
                    content: 'Test Question',
                    userId: 'user1',
                })
            );
        });

        it('should create a new answer', async () => {
            const answerData = {
                text: 'Test Answer',
                userId: 'user2',
                questionId: testQuestion.id,
            };

            const result = await service.createAnswear(answerData);

            expect(result).toBeDefined();
            expect(result.text).toBe(answerData.text);
            expect(result.userId).toBe(answerData.userId);
            expect(result.question?.id).toBe(testQuestion.id);

            const savedAnswer = await answearRepository.findOne({
                where: { id: result.id },
                relations: ['question'],
            });
            expect(savedAnswer).toBeDefined();
            expect(savedAnswer?.text).toBe(answerData.text);
        });

        it('should throw error when question not found', async () => {
            const answerData = {
                text: 'Test Answer',
                userId: 'user2',
                questionId: 'non-existent-id',
            };

            await expect(service.createAnswear(answerData)).rejects.toThrow(RpcException);
        });
    });

    describe('getTotalNrAnswears', () => {
        beforeEach(async () => {
            const question = await questionRepository.save(
                questionRepository.create({
                    content: 'Test Question',
                    userId: 'user1',
                })
            );

            await answearRepository.save([
                answearRepository.create({
                    text: 'Answer 1',
                    userId: 'user1',
                    question: question,
                }),
                answearRepository.create({
                    text: 'Answer 2',
                    userId: 'user2',
                    question: question,
                }),
                answearRepository.create({
                    text: 'Answer 3',
                    userId: 'user1',
                    question: question,
                }),
            ]);
        });

        it('should return correct total number of answers', async () => {
            const result = await service.getTotalNrAnswears();
            expect(result).toBe(3);
        });
    });

    describe('getAvgAnswearPerUser', () => {
        beforeEach(async () => {
            const question = await questionRepository.save(
                questionRepository.create({
                    content: 'Test Question',
                    userId: 'user1',
                })
            );

            await answearRepository.save([
            
                answearRepository.create({
                    text: 'Answer 1',
                    userId: 'user1',
                    question: question,
                }),
                answearRepository.create({
                    text: 'Answer 2',
                    userId: 'user1',
                    question: question,
                }),
            
                answearRepository.create({
                    text: 'Answer 3',
                    userId: 'user2',
                    question: question,
                }),
            ]);
        });

        it('should return correct average answers per user', async () => {
            const result = await service.getAvgAnswearPerUser();
            expect(result).toBe(1.5);
        });
    });

});