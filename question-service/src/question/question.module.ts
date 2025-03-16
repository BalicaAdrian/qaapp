import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service'; // Import QuestionService
import { AnswerModule } from 'src/answear/answear.module';
import { Answear } from 'src/answear/answear.entity';
import { Vote } from 'src/vote/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Answear, Vote])
  ],
  controllers: [QuestionController],
  providers: [QuestionService], // Add QuestionService to providers
  exports: [TypeOrmModule, QuestionService],
})
export class QuestionModule { }