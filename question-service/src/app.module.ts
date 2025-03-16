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

@Module({
imports: [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost', // Use environment variables
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3310,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'question_db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Scan for entities
    synchronize: true, // Auto-create schema in dev
  }),
  QuestionModule,
  AnswerModule,
  VoteModule,
  MetricsModule
],
controllers: [AppController, AnswearController, VoteController, MetricsController],
providers: [AppService],
})
export class AppModule {}