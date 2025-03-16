import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { QuestionController } from './question/question.controller';
import { ResponseFactory } from './factories/responseFactory';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APP_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: 'app-service', //docker
          host: 'localhost', //docker
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [UserController, QuestionController],
  providers: [ResponseFactory],
})
export class AppModule {}