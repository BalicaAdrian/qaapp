import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { Question } from '../question/question.entity';
import { Answear } from '../answear/answear.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

describe('VoteService', () => {
    let service: VoteService;
    let voteRepository: Repository<Vote>;
    let questionRepository: Repository<Question>;
    let answearRepository: Repository<Answear>;

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VoteService,
                {
                    provide: getRepositoryToken(Vote),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        count: jest.fn(),
                        createQueryBuilder: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Question),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Answear),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<VoteService>(VoteService);
        voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
        questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
        answearRepository = module.get<Repository<Answear>>(getRepositoryToken(Answear));
    });

    describe('voteQuestion', () => {
        const mockQuestion = {
            id: 'question1',
            content: 'Test question',
        };

        const mockVote = {
            id: 'vote1',
            userId: 'user1',
            isUpVote: true,
            question: mockQuestion,
        };

        const voteData = {
            userId: 'user1',
            questionId: 'question1',
            isUpVote: true,
        };

        it('should create a new vote for a question', async () => {
            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion as any);

            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(null)  
                .mockResolvedValueOnce(mockVote as any); 

            jest.spyOn(voteRepository, 'create').mockReturnValue(mockVote as any);
            jest.spyOn(voteRepository, 'save').mockResolvedValue(mockVote as any);
            jest.spyOn(questionRepository, 'save').mockResolvedValue(mockQuestion as any);

            const result = await service.voteQuestion(voteData);

            expect(result).toBeDefined();
            expect(result.userId).toBe(voteData.userId);
            expect(result.isUpVote).toBe(voteData.isUpVote);
            expect(voteRepository.findOne).toHaveBeenCalledTimes(2);
        });

        it('should update existing vote for a question', async () => {
            const existingVote = { ...mockVote, isUpVote: false };

            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion as any);

            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(existingVote as any) 
                .mockResolvedValueOnce(existingVote as any);  

            jest.spyOn(voteRepository, 'save').mockResolvedValue(existingVote as any);
            jest.spyOn(questionRepository, 'save').mockResolvedValue(mockQuestion as any);

            const result = await service.voteQuestion({ ...voteData, isUpVote: false });

            expect(result.isUpVote).toBe(false);
            expect(voteRepository.findOne).toHaveBeenCalledTimes(2);
        });

        it('should throw error when question not found', async () => {
            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);

            await expect(service.voteQuestion(voteData)).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Question not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });

        it('should throw error when vote not found after creation', async () => {
            jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion as any);
            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(null)  
                .mockResolvedValueOnce(null); 
            jest.spyOn(voteRepository, 'create').mockReturnValue(mockVote as any);
            jest.spyOn(voteRepository, 'save').mockResolvedValue(mockVote as any);

            await expect(service.voteQuestion(voteData)).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Vote not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });
    });

    describe('voteAnswear', () => {
        const mockAnswer = {
            id: 'answer1',
            text: 'Test answer',
        };

        const mockVote = {
            id: 'vote1',
            userId: 'user1',
            isUpVote: true,
            answear: mockAnswer,
        };

        const voteData = {
            userId: 'user1',
            answearId: 'answer1',
            isUpVote: true,
        };

        it('should create a new vote for an answer', async () => {
      
            jest.spyOn(answearRepository, 'findOne').mockResolvedValue(mockAnswer as any);

          
            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(null)  
                .mockResolvedValueOnce(mockVote as any); 

            jest.spyOn(voteRepository, 'create').mockReturnValue(mockVote as any);
            jest.spyOn(voteRepository, 'save').mockResolvedValue(mockVote as any);
            jest.spyOn(answearRepository, 'save').mockResolvedValue(mockAnswer as any);

            const result = await service.voteAnswear(voteData);

            expect(result).toBeDefined();
            expect(result.userId).toBe(voteData.userId);
            expect(result.isUpVote).toBe(voteData.isUpVote);
            expect(result.answear).toBeDefined();
            expect(result.answear.id).toBe(mockAnswer.id);
            expect(voteRepository.findOne).toHaveBeenCalledTimes(2);
        });

        it('should update existing vote for an answer', async () => {
            const existingVote = { ...mockVote, isUpVote: false };

            jest.spyOn(answearRepository, 'findOne').mockResolvedValue(mockAnswer as any);

         
            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(existingVote as any)  
                .mockResolvedValueOnce(existingVote as any); 

            jest.spyOn(voteRepository, 'save').mockResolvedValue(existingVote as any);
            jest.spyOn(answearRepository, 'save').mockResolvedValue(mockAnswer as any);

            const result = await service.voteAnswear({ ...voteData, isUpVote: false });

            expect(result).toBeDefined();
            expect(result.isUpVote).toBe(false);
            expect(voteRepository.findOne).toHaveBeenCalledTimes(2);
        });

        it('should throw error when answer not found', async () => {
            jest.spyOn(answearRepository, 'findOne').mockResolvedValue(null);

            await expect(service.voteAnswear(voteData)).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Answer not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });

        it('should throw error when vote not found after creation', async () => {
            jest.spyOn(answearRepository, 'findOne').mockResolvedValue(mockAnswer as any);

            
            jest.spyOn(voteRepository, 'findOne')
                .mockResolvedValueOnce(null)  
                .mockResolvedValueOnce(null); 

            jest.spyOn(voteRepository, 'create').mockReturnValue(mockVote as any);
            jest.spyOn(voteRepository, 'save').mockResolvedValue(mockVote as any);
            jest.spyOn(answearRepository, 'save').mockResolvedValue(mockAnswer as any);

            await expect(service.voteAnswear(voteData)).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Vote not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });

        it('should throw RpcException on general error', async () => {
            jest.spyOn(answearRepository, 'findOne').mockRejectedValue(new Error('Database error'));

            await expect(service.voteAnswear(voteData)).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Faield to vote answear',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    }),
                }),
            );
        });
    });

    describe('getTotalNrvotes', () => {
        it('should return total number of votes', async () => {
            const expectedCount = 10;
            jest.spyOn(voteRepository, 'count').mockResolvedValue(expectedCount);

            const result = await service.getTotalNrvotes();

            expect(result).toBe(expectedCount);
        });

        it('should throw RpcException on error', async () => {
            jest.spyOn(voteRepository, 'count').mockRejectedValue(new Error());

            await expect(service.getTotalNrvotes()).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Failed to get total votes',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    }),
                }),
            );
        });
    });

    describe('getAvgVotesPerUser', () => {
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            getRawOne: jest.fn(),
        };

        beforeEach(() => {
            jest.spyOn(voteRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
        });

        it('should return average votes per user', async () => {
            const mockNestedQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
            };

            mockQueryBuilder.from.mockImplementation((callback) => {
                callback(mockNestedQueryBuilder);
                return mockQueryBuilder;
            });

            mockQueryBuilder.getRawOne.mockResolvedValue({ average: '2.5' });

            const result = await service.getAvgVotesPerUser();

            expect(result).toBe(2.5);
        });

        it('should throw RpcException on error', async () => {
            mockQueryBuilder.getRawOne.mockRejectedValue(new Error());

            await expect(service.getAvgVotesPerUser()).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Failed to get avg votes',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    }),
                }),
            );
        });
    });

    describe('getMostPopularDayOfWeek', () => {
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getRawOne: jest.fn(),
        };

        beforeEach(() => {
            jest.spyOn(voteRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
        });

        it('should return the most popular day of the week', async () => {
            mockQueryBuilder.getRawOne.mockResolvedValue({ day_name: 'Monday' });

            const result = await service.getMostPopularDayOfWeek();

            expect(result).toBe('Monday');
        });

        it('should throw RpcException when no votes exist', async () => {
            mockQueryBuilder.getRawOne.mockResolvedValue(null);

            await expect(service.getMostPopularDayOfWeek()).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Failed to get best day of the week',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    }),
                }),
            );
        });
    });
});