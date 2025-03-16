import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Question } from '../question/question.entity';
import { Vote } from './vote.entity';
import { Answear } from 'src/answear/answear.entity';

@Module({
imports: [TypeOrmModule.forFeature([Vote, Question, Answear])],
controllers: [VoteController],
providers: [VoteService],
exports: [TypeOrmModule, VoteService],
})
export class VoteModule {}