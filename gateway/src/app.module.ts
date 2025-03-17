import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { QuestionController } from './question/question.controller';
import { ResponseFactory } from './factories/responseFactory';
import { AuthModule } from './authentification/auth.module';
// import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    AuthModule,
    // PassportModule.register({ session: true }), /google bug
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT_KEY,
      signOptions: { expiresIn: '2h' },
    }),

  ],
  controllers: [UserController, QuestionController],
  providers: [ResponseFactory],
})
export class AppModule {}