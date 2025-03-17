import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import * as session from 'express-session'; //google bug
// import * as passport from 'passport'; //google bug
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('QAAP')
    .setDescription('The QAAP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('QAAPP')
    .build();
  const document = SwaggerModule.createDocument(app, config);


  // app.useGlobalPipes(new ValidationPipe()); // Add ValidationPipe
  SwaggerModule.setup('api', app, document);

  //google bug
  // app.use(
  //   session({
  //     secret: "adwdawda",
  //     saveUninitialized: false,
  //     resave: false,
  //     cookie: {
  //       maxAge: 60000,
  //     },
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(8080); // Gateway listens on port 8080
}
bootstrap();