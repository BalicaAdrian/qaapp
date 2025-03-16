import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AnswearService } from 'src/answear/answear.service';
import { MetricsInterface } from 'src/question/interfaces/metricsInterface.interface';
import { QuestionService } from 'src/question/question.service';
import { VoteService } from 'src/vote/vote.service';

@Controller('metrics')
export class MetricsController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly answearSerivce: AnswearService,
        private readonly voteService: VoteService,

    ) { }

    @MessagePattern({ cmd: 'get_question_metrics' })
    async getQuestionMetrics(): Promise<MetricsInterface> {

        const totalNrQuestions = await this.questionService.getTotalNrQuestions();
        const totalNrAnswears = await this.answearSerivce.getTotalNrAnswears();
        const totalNrVotes = await this.voteService.getTotalNrvotes();
        const avgVotesPerUser = await this.voteService.getAvgVotesPerUser();
        const avgAnswearsPerUser = await this.questionService.getAvgQuestionPerUser();
        const avgQuestionsPerUser = await this.answearSerivce.getAvgAnswearPerUser();
        const mostPopularDayOfTheWeekBasedOnVotes = await this.voteService.getMostPopularDayOfWeek();
        
        const result: MetricsInterface = {
            totalNrAnswears,
            totalNrVotes,
            totalNrQuestions,
            avgVotesPerUser,
            avgAnswearsPerUser,
            avgQuestionsPerUser,
            mostPopularDayOfTheWeekBasedOnVotes
        }

        return result;
    }
}


