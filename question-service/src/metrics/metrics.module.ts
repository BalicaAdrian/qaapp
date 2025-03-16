import { Module } from '@nestjs/common';
import { AnswerModule } from 'src/answear/answear.module';
import { QuestionModule } from 'src/question/question.module';
import { VoteModule } from 'src/vote/vote.module';
import { MetricsController } from './metrics.controller';
import { QuestionService } from 'src/question/question.service';
import { VoteService } from 'src/vote/vote.service';
import { AnswearService } from 'src/answear/answear.service';

@Module({
    imports: [
        QuestionModule,
        VoteModule,
        AnswerModule
    ],
    controllers: [MetricsController],
    providers: [], 
    exports: [],
})
export class MetricsModule { }