import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { QuestionService } from './question.service';
import { QuestionInterface } from './interfaces/questionInterface.interface';
import { MetricsInterface } from './interfaces/metricsInterface.interface';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern({ cmd: 'get_question' })
  async getQuestion(data: { questionId: string }): Promise<QuestionInterface> {
    return this.questionService.getQuestion(data.questionId);
  }

  @MessagePattern({ cmd: 'create_question' })
  async createQuestion(data: QuestionInterface): Promise<QuestionInterface> {
    console.log(data)
    return this.questionService.createQuestion(data);
  }

  @MessagePattern({ cmd: 'get_all_questions' })
  async getAllQuestions(): Promise<QuestionInterface[]> {
    return this.questionService.getAllQuestions();
  }

  
}