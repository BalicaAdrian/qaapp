import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { Answear } from '../answear/answear.entity';
import { Vote } from '../vote/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Answear, Vote])
  ],
  controllers: [QuestionController],
  providers: [QuestionService], 
  exports: [TypeOrmModule, QuestionService],
})
export class QuestionModule { }