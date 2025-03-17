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
          // host: 'user-service', // Use the service name from docker-compose 
          host: 'localhost', //locally
          port: 3001,
        },
      },
      {
        name: 'QUESTION_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: 'question-service', // Use the service name from docker-compose
          host: 'localhost', //locally
          port: 3002,
        },
      },
    ])
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER, // Provide APP_FILTER
      useClass: AllExceptionsFilter, // Use AllExceptionsFilter
    },
    AppService,
    QuestionsGateway
  ],
})
export class AppModule { }