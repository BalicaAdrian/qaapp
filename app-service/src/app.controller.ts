import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { VoteInterface } from './interfaces/voteInterface.interface';
import { QuestionInterface } from './interfaces/questionInterface.interface';
import { AnswearInterface } from './interfaces/answerInterface.interface';
import { UserInterface } from './interfaces/userInterface.interface';
import { AppService } from './app.service';
import { MetricsInterface } from './interfaces/metricsInterface.interface';
import { createClient } from 'redis';
@Controller()

export class AppController implements OnModuleInit {
  private redisClient;
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('QUESTION_SERVICE') private readonly questionServiceClient: ClientProxy,
    private readonly appSerivice: AppService,
  ) { }

  async onModuleInit() {
    this.redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379
      }
    });

    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    this.redisClient.on('connect', () => console.log(`Successfully connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`));

    await this.redisClient.connect();
  }

  //questions
  @MessagePattern({ cmd: 'get_question' })
  async getQuestion(data: QuestionInterface): Promise<QuestionInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'get_question' }, data),
      'getQuestion'
    );
  }

  @MessagePattern({ cmd: 'create_question' })
  async createQuestion(data: QuestionInterface): Promise<QuestionInterface> {

    await this.redisClient.del("get_all_questions");

    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'create_question' }, data),
      'createQuestion'
    );
  }

  @MessagePattern({ cmd: 'get_all_questions' })
  async getAllQuestion(): Promise<QuestionInterface[]> {

    const cachedQuestions = await this.redisClient.get("get_all_questions");

    if (cachedQuestions) {
      console.log("din CAHCE")
      return JSON.parse(cachedQuestions);
    }

    const result = await this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'get_all_questions' }, {}),
      'getAllQuestions'
    );
    console.log("res", result)

    await this.redisClient.set("get_all_questions", JSON.stringify(result), { EX: 1000000 });

    return result;

  }

  @MessagePattern({ cmd: 'create_answear' })
  async createAnswear(data: AnswearInterface): Promise<AnswearInterface> {
    await this.redisClient.del("get_all_questions");

    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'create_answear' }, data),
      'createAnswear'
    );
  }

  @MessagePattern({ cmd: 'vote_question' })
  async voteQuestion(data: VoteInterface): Promise<VoteInterface> {
    await this.redisClient.del("get_all_questions");

    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'vote_question' }, data),
      'voteQuestion'
    );
  }

  @MessagePattern({ cmd: 'vote_asnwear' })
  async voteAsnwear(data: VoteInterface): Promise<VoteInterface> {
    await this.redisClient.del("get_all_questions");

    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'vote_asnwear' }, data),
      'voteAsnwear'
    );
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUserByEmail(data: UserInterface): Promise<UserInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.userServiceClient.send({ cmd: 'get_user_by_email' }, data),
      'getUserByEmail'
    );
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(data: UserInterface): Promise<UserInterface> {

    return this.appSerivice.handleMicroserviceRequest(
      this.userServiceClient.send({ cmd: 'get_user_by_id' }, data),
      'getUserById'
    );
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: UserInterface): Promise<UserInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.userServiceClient.send({ cmd: 'create_user' }, data),
      'createUser'
    );
  }

  @MessagePattern({ cmd: 'app_metrics' })
  async appMetrics(data: any): Promise<MetricsInterface> {

    let userServiceMetrics = await this.appSerivice.handleMicroserviceRequest(
      this.userServiceClient.send({ cmd: 'get_total_users' }, data),
      'userMetrics'
    );

    let questionServiceMetrics = await this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'get_question_metrics' }, data),
      'questionMetrics'
    );

    const result: MetricsInterface = {
      ...questionServiceMetrics,
      totalNrUsers: userServiceMetrics
    }

    return result;
  }
}