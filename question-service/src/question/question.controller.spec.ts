import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

describe('QuestionController', () => {
let controller: QuestionController;
let service: QuestionService;

const mockQuestion = {
  id: '1',
  content: 'Test question',
  userId: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQuestions = [
  mockQuestion,
  {
    id: '2',
    content: 'Another test question',
    userId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [QuestionController],
    providers: [
      {
        provide: QuestionService,
        useValue: {
          getQuestion: jest.fn(),
          createQuestion: jest.fn(),
          getAllQuestions: jest.fn(),
        },
      },
    ],
  }).compile();

  controller = module.get<QuestionController>(QuestionController);
  service = module.get<QuestionService>(QuestionService);
});

it('should be defined', () => {
  expect(controller).toBeDefined();
});

describe('getQuestion', () => {
  it('should return a question by id', async () => {
    jest.spyOn(service, 'getQuestion').mockResolvedValue(mockQuestion);

    const result = await controller.getQuestion({ questionId: '1' });

    expect(result).toBe(mockQuestion);
    expect(service.getQuestion).toHaveBeenCalledWith('1');
  });

  it('should throw RpcException when question not found', async () => {
    jest.spyOn(service, 'getQuestion').mockRejectedValue(
      new RpcException({
        message: 'Question not found',
        status: HttpStatus.NOT_FOUND,
      }),
    );

    await expect(controller.getQuestion({ questionId: '999' })).rejects.toThrow(RpcException);
    expect(service.getQuestion).toHaveBeenCalledWith('999');
  });
});

describe('createQuestion', () => {
  const createQuestionDto = {
    content: 'New question',
    userId: 'user1',
  };

  it('should create a new question', async () => {
    const createdQuestion = {
      id: '3',
      ...createQuestionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'createQuestion').mockResolvedValue(createdQuestion);

    const result = await controller.createQuestion(createQuestionDto);

    expect(result).toBe(createdQuestion);
    expect(service.createQuestion).toHaveBeenCalledWith(createQuestionDto);
  });

  it('should throw RpcException on creation error', async () => {
    jest.spyOn(service, 'createQuestion').mockRejectedValue(
      new RpcException({
        message: 'Failed to create question',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }),
    );

    await expect(controller.createQuestion(createQuestionDto)).rejects.toThrow(RpcException);
    expect(service.createQuestion).toHaveBeenCalledWith(createQuestionDto);
  });
});

describe('getAllQuestions', () => {
  it('should return all questions', async () => {
    jest.spyOn(service, 'getAllQuestions').mockResolvedValue(mockQuestions);

    const result = await controller.getAllQuestions();

    expect(result).toBe(mockQuestions);
    expect(service.getAllQuestions).toHaveBeenCalled();
  });

  it('should throw RpcException when no questions found', async () => {
    jest.spyOn(service, 'getAllQuestions').mockRejectedValue(
      new RpcException({
        message: 'No questions found',
        status: HttpStatus.NOT_FOUND,
      }),
    );

    await expect(controller.getAllQuestions()).rejects.toThrow(RpcException);
    expect(service.getAllQuestions).toHaveBeenCalled();
  });
});
});