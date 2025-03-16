import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { VoteInterface } from './interfaces/voteInterface.interface';
import { QuestionInterface } from './interfaces/questionInterface.interface';
import { AnswearInterface } from './interfaces/answerInterface.interface';
import { UserInterface } from './interfaces/userInterface.interface';
import { AppService } from './app.service';
import { MetricsInterface } from './interfaces/metricsInterface.interface';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('QUESTION_SERVICE') private readonly questionServiceClient: ClientProxy,
    private readonly appSerivice: AppService
  ) { }

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
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'create_question' }, data),
      'createQuestion'
    );
  }

  @MessagePattern({ cmd: 'get_all_questions' })
  async getAllQuestion(): Promise<QuestionInterface[]> {
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'get_all_questions' }, {}),
      'getAllQuestions'
    );
  }

  @MessagePattern({ cmd: 'create_answear' })
  async createAnswear(data: AnswearInterface): Promise<AnswearInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'create_answear' }, data),
      'createAnswear'
    );
  }

  @MessagePattern({ cmd: 'vote_question' })
  async voteQuestion(data: VoteInterface): Promise<VoteInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'vote_question' }, data),
      'voteQuestion'
    );
  }

  @MessagePattern({ cmd: 'vote_asnwear' })
  async voteAsnwear(data: VoteInterface): Promise<VoteInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.questionServiceClient.send({ cmd: 'vote_asnwear' }, data),
      'voteAsnwear'
    );
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(data: UserInterface): Promise<UserInterface> {
    return this.appSerivice.handleMicroserviceRequest(
      this.userServiceClient.send({ cmd: 'get_user' }, data),
      'getUser'
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
    console.log("info2")

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