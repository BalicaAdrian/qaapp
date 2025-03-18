import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswearController } from './answear/answear.controller';
import { AnswerModule } from './answear/answear.module';
import { AnswearService } from './answear/answear.service';
import { VoteController } from './vote/vote.controller';
import { VoteModule } from './vote/vote.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { dataSourceOptions } from './typeorm.config';

@Module({
imports: [
  TypeOrmModule.forRoot(dataSourceOptions),
  QuestionModule,
  AnswerModule,
  VoteModule,
  MetricsModule
],
controllers: [AppController, AnswearController, VoteController, MetricsController],
providers: [AppService],
})
export class AppModule {}