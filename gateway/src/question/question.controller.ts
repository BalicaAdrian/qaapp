import { Controller, Get, Post, Inject, Param, Body, Res, UsePipes, ValidationPipe, HttpStatus, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ResponseFactory } from 'src/factories/responseFactory';
import { CreateQuestionDto } from './dtos/createQuestionDto.dto';
import { QuestionInterface } from './interfaces/questionInterface.dto';
import { CreateAnswerDto } from './dtos/createNaswearDto';
import { CreateVoteDto } from './dtos/voteDto.dto';
import { VoteInterface } from './interfaces/voteInterface.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnswearInterface } from './interfaces/answearInterface.dto';
// import { GoogleTokenGuard } from 'src/authentification/guards/auth.guard';
import { AuthGuard } from 'src/authentification/guards/auth-jwt.guard';
// import { IsAuthenticated } from 'src/authentification/guards/auth.guard';

@ApiTags("QA app logic")
@ApiBearerAuth()
@Controller('question-service')
export class QuestionController {
  constructor(
    @Inject('APP_SERVICE') private readonly appServiceClient: ClientProxy,
    private readonly responseFactory: ResponseFactory,
  ) { }

  @UseGuards(AuthGuard)
  @Get('/metrics')
  async appMetrics(@Res() res: Response) {
    const metrics: any[] = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'app_metrics' }, {}),
    );
    return this.responseFactory.handleResponse(metrics, res);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getQuestion(@Param('id') id: string, @Res() res: Response) {
  
    const question: QuestionInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'get_question' }, { questionId: id }),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getAllQuestion(@Res() res: Response, @Req() req: Request) {
    const question: QuestionInterface[] = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'get_all_questions' }, {}),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  
  @UseGuards(AuthGuard)
  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const userId =  req["user"].id;
    console.log("d", userId)
    const question: QuestionInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'create_question' }, { ...createQuestionDto, userId: userId }),
    );
    return this.responseFactory.handleResponse(question, res);
  }

  @UseGuards(AuthGuard)
  @Post(':id/answers')
  async createAnswear(
    @Param('id') questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId =  req["user"].id;
    const answear: AnswearInterface = await firstValueFrom(
      this.appServiceClient.send(
        { cmd: 'create_answear' },
        { ...createAnswerDto, questionId: questionId, userId: userId },
      ),
    );
    return this.responseFactory.handleResponse(answear, res);
  }

  @UseGuards(AuthGuard)
  @Post('vote/question/:id')
  async voteQuestion(
    @Param('id') id: string,
    @Body() createVoteDto: CreateVoteDto,
    @Req() req: Request,
    @Res() res: Response) {
    
    const userId =  req["user"].id;
    const vote: VoteInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'vote_question' }, { ...createVoteDto, questionId: id, userId: userId }),
    );
    return this.responseFactory.handleResponse(vote, res);
  }

  
  @UseGuards(AuthGuard)
  @Post('vote/answear/:id')
  async voteAsnwear(
    @Param('id') id: string,
    @Body() createVoteDto: CreateVoteDto,
    @Req() req: Request,
    @Res() res: Response) {

    const userId =  req["user"].id;
    const vote: VoteInterface = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'vote_asnwear' }, { ...createVoteDto, answearId: id, userId: userId }),
    );
    return this.responseFactory.handleResponse(vote, res);
  }


}