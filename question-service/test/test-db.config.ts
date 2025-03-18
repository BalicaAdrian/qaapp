import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Vote } from '../src/vote/vote.entity';
import { Question } from '../src/question/question.entity';
import { Answear } from '../src/answear/answear.entity';

export const testDbConfig: TypeOrmModuleOptions = {
type: 'sqlite',
database: ':memory:',
entities: [Vote, Question, Answear],
synchronize: true,
dropSchema: true,
};