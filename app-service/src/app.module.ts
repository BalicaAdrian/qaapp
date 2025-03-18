import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exception.filter';
import { AppService } from './app.service';
import { QuestionsGateway } from './gateway/questions.gateway';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || "localhost",
          port: process.env.USER_SERVICE_PORT ? +process.env.USER_SERVICE_PORT : 3001,
        },
      },
      {
        name: 'QUESTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.QUESTION_SERVICE_HOST || "localhost",
          port: process.env.QUESTION_SERVICE_PORT ? +process.env.QUESTION_SERVICE_PORT : 3002,
        },
      },
    ])
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER, 
      useClass: AllExceptionsFilter, 
    },
    AppService,
    QuestionsGateway
  ],
})
export class AppModule { }