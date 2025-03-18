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

        const [
            totalNrQuestions,
            totalNrAnswears,
            totalNrVotes,
            avgVotesPerUser,
            avgAnswearsPerUser,
            avgQuestionsPerUser,
            mostPopularDayOfTheWeekBasedOnVotes
        ] = await Promise.all([
            this.questionService.getTotalNrQuestions(),
            this.answearSerivce.getTotalNrAnswears(),
            this.voteService.getTotalNrvotes(),
            this.voteService.getAvgVotesPerUser(),
            this.questionService.getAvgQuestionPerUser(),
            this.answearSerivce.getAvgAnswearPerUser(),
            this.voteService.getMostPopularDayOfWeek()
        ]);
        
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


