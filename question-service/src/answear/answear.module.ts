import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answear } from './answear.entity';
import { AnswearController } from './answear.controller';
import { AnswearService } from './answear.service';
import { Vote } from 'src/vote/vote.entity';
import { Question } from 'src/question/question.entity';


@Module({
imports: [TypeOrmModule.forFeature([Answear, Vote, Question])],
controllers: [AnswearController],
providers: [AnswearService],
exports: [TypeOrmModule, AnswearService],
})
export class AnswerModule {}