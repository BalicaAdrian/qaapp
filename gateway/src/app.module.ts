import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { QuestionController } from './question/question.controller';
import { ResponseFactory } from './factories/responseFactory';
import { AuthModule } from './authentification/auth.module';
import { PassportModule } from '@nestjs/passport';



@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APP_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'app-service', //docker
          // host: 'localhost', //docker
          port: 3000,
        },
      },
    ]),
    AuthModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [UserController, QuestionController],
  providers: [ResponseFactory],
})
export class AppModule {}