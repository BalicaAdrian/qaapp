import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Vote } from '../vote/vote.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

describe('QuestionService', () => {
    let service: QuestionService;
    let questionRepository: Repository<Question>;
    let voteRepository: Repository<Vote>;

    const mockQuestion = {
        id: '1',
        content: 'Test question',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        answears: [
            {
                id: '1',
                text: 'Test answer',
                userId: 'user2',
            },
        ],
    };

    const mockQuestions = [
        {
            question_id: '1',
            question_content: 'Test question 1',
            question_userId: 'user1',
            question_createdAt: new Date(),
            question_updatedAt: new Date(),
            nrOfPositiveVotes: '2',
            nrOfNegativeVotes: '1',
            nrOfAnswers: '1',
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionService,
                {
                    provide: getRepositoryToken(Question),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        count: jest.fn(),
                        createQueryBuilder: jest.fn(() => ({
                            leftJoin: jest.fn().mockReturnThis(),
                            select: jest.fn().mockReturnThis(),
                            from: jest.fn().mockReturnThis(),
                            groupBy: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            getRawMany: jest.fn(),
                            getRawOne: jest.fn(),
                        })),
                    },
                },
                {
                    provide: getRepositoryToken(Vote),
                    useValue: {
                        count: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<QuestionService>(QuestionService);
        questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
        voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    });

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getQuestion', () => {
        it('should return a question with vote counts', async () => {
            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion as any);
            jest.spyOn(voteRepository, 'count').mockResolvedValueOnce(5); 
            jest.spyOn(voteRepository, 'count').mockResolvedValueOnce(2);
            jest.spyOn(voteRepository, 'count').mockResolvedValueOnce(3);
            jest.spyOn(voteRepository, 'count').mockResolvedValueOnce(1); 

            const result = await service.getQuestion('1');

            expect(result).toBeDefined();
            expect(result.id).toBe(mockQuestion.id);
            expect(result.nrOfPositiveVotes).toBe(5);
            expect(result.nrOfNegativeVotes).toBe(2);
            expect(questionRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['answears'],
            });
        });

        it('should throw RpcException when question not found', async () => {
            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);

            await expect(service.getQuestion('1')).rejects.toThrow(RpcException);
        });
    });

    describe('getAllQuestions', () => {
        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn(),
        };

        beforeEach(() => {

            jest.spyOn(questionRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
        });

        it('should return all questions with vote counts', async () => {
            mockQueryBuilder.getRawMany.mockResolvedValueOnce(mockQuestions);

            const result = await service.getAllQuestions();

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(mockQuestions[0].question_id);


            expect(questionRepository.createQueryBuilder).toHaveBeenCalledWith('question');
            expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('question.answears', 'answear');
            expect(mockQueryBuilder.select).toHaveBeenCalledWith([
                'question.id',
                'question.content',
                'question.userId',
                'question.createdAt',
                'question.updatedAt',
                '(SELECT COUNT(*) FROM vote WHERE vote.questionId = question.id AND vote.isUpVote = 1) as nrOfPositiveVotes',
                '(SELECT COUNT(*) FROM vote WHERE vote.questionId = question.id AND vote.isUpVote = 0) as nrOfNegativeVotes',
                'COUNT(DISTINCT answear.id) as nrOfAnswers',
            ]);
            expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('question.id');
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('nrOfPositiveVotes', 'DESC');
            expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
        });

        it('should throw RpcException when no questions found', async () => {
            mockQueryBuilder.getRawMany.mockResolvedValueOnce([]);

            await expect(service.getAllQuestions()).rejects.toThrow(RpcException);

            expect(questionRepository.createQueryBuilder).toHaveBeenCalled();
            expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
        });
    });

    describe('createQuestion', () => {
        it('should create a new question', async () => {
            const questionData = {
                content: 'New question',
                userId: 'user1',
            };

            jest.spyOn(questionRepository, 'create').mockReturnValue(questionData as any);
            jest.spyOn(questionRepository, 'save').mockResolvedValue({
                id: '1',
                ...questionData,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const result = await service.createQuestion(questionData as any);

            expect(result).toBeDefined();
            expect(result.content).toBe(questionData.content);
            expect(questionRepository.create).toHaveBeenCalledWith(questionData);
        });

        it('should throw RpcException on creation error', async () => {
            jest.spyOn(questionRepository, 'save').mockRejectedValue(new Error());

            await expect(service.createQuestion({} as any)).rejects.toThrow(RpcException);
        });
    });

    describe('getTotalNrQuestions', () => {
        it('should return total number of questions', async () => {
            const expectedCount = 10;
            jest.spyOn(questionRepository, 'count').mockResolvedValue(expectedCount);

            const result = await service.getTotalNrQuestions();

            expect(result).toBe(expectedCount);
            expect(questionRepository.count).toHaveBeenCalled();
        });

        it('should throw RpcException on error', async () => {
            jest.spyOn(questionRepository, 'count').mockRejectedValue(new Error());

            await expect(service.getTotalNrQuestions()).rejects.toThrow(RpcException);
        });
    });

    describe('getAvgQuestionPerUser', () => {
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            getRawOne: jest.fn(),
        };

        beforeEach(() => {
            jest.spyOn(questionRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
        });

        it('should return average questions per user', async () => {

            const mockNestedQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
            };

            mockQueryBuilder.from.mockImplementation((callback) => {

                callback(mockNestedQueryBuilder);
                return mockQueryBuilder;
            });

            mockQueryBuilder.getRawOne.mockResolvedValueOnce({ average: '2.5' });

            const result = await service.getAvgQuestionPerUser();

            expect(result).toBe(2.5);


            expect(questionRepository.createQueryBuilder).toHaveBeenCalledWith('question');
            expect(mockQueryBuilder.select).toHaveBeenCalledWith('AVG(question_count)', 'average');

            expect(mockNestedQueryBuilder.select).toHaveBeenCalledWith('COUNT(*)', 'question_count');
            expect(mockNestedQueryBuilder.from).toHaveBeenCalledWith(Question, 'q');
            expect(mockNestedQueryBuilder.groupBy).toHaveBeenCalledWith('q.userId');

            expect(mockQueryBuilder.getRawOne).toHaveBeenCalled();
        });

        it('should throw RpcException on error', async () => {
            mockQueryBuilder.getRawOne.mockRejectedValueOnce(new Error('Database error'));

            await expect(service.getAvgQuestionPerUser()).rejects.toThrow(RpcException);

            expect(questionRepository.createQueryBuilder).toHaveBeenCalled();
            expect(mockQueryBuilder.getRawOne).toHaveBeenCalled();
        });
    });
});