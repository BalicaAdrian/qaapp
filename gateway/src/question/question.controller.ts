import { Controller, Get, Post, Inject, Param, Body, Res, UsePipes, ValidationPipe, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ResponseFactory } from 'src/factories/responseFactory';
import { CreateQuestionDto } from './dtos/createQuestionDto.dto';
import { QuestionInterface } from './interfaces/questionInterface.dto';
import { CreateAnswerDto } from './dtos/createNaswearDto';
import { CreateVoteDto } from './dtos/voteDto.dto';
import { VoteInterface } from './interfaces/voteInterface.interface';
import { ApiTags } from '@nestjs/swagger';
import { AnswearInterface } from './interfaces/answearInterface.dto';

@ApiTags("QA app logic")
@Controller('question-service')
export class QuestionController {
  constructor(
    @Inject('APP_SERVICE') private readonly appServiceClient: ClientProxy,
    private readonly responseFactory: ResponseFactory,
  ) { }

  @Get('/metrics')
  async appMetrics(@Res() res: Response) {
    const metrics: any[] = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'app_metrics' }, {}),
    );
    return this.responseFactory.handleResponse(metrics, res);
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string, @Res() res: Response) {
    const question: QuestionInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'get_question' }, { questionId: id }),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  @Get('')
  async getAllQuestion(@Res() res: Response) {
    const question: QuestionInterface[] = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'get_all_questions' }, {}),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto, @Res() res: Response) {
    const userId = 'some-hardcoded-user-id'; // Replace with actual user ID
    const question: QuestionInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'create_question' }, { ...createQuestionDto, userId: userId }),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  @Post(':id/answers')
  @UsePipes(new ValidationPipe())
  async createAnswear(
    @Param('id') questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @Res() res: Response,
  ) {
    const userId = '444'; // Replace with actual user ID
    const answear: AnswearInterface = await firstValueFrom(
      this.appServiceClient.send(
        { cmd: 'create_answear' },
        { ...createAnswerDto, questionId: questionId, userId: userId },
      ),
    );
    return this.responseFactory.handleResponse(answear, res);
  }

  @Post('vote/question/:id')
  async voteQuestion(
    @Param('id') id: string,
    @Body() createVoteDto: CreateVoteDto,
    @Res() res: Response) {
    const userId = '444'; // Replace with actual user ID
    const vote: VoteInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'vote_question' }, { ...createVoteDto, questionId: id, userId: userId }),
    );
    return this.responseFactory.handleResponse(vote, res);
  }

  @Post('vote/answear/:id')
  async voteAsnwear(
    @Param('id') id: string,
    @Body() createVoteDto: CreateVoteDto,
    @Res() res: Response) {
    const userId = '444'; // Replace with actual user ID
    const vote: VoteInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'vote_asnwear' }, { ...createVoteDto, questionId: id, userId: userId }),
    );
    return this.responseFactory.handleResponse(vote, res);
  }


}