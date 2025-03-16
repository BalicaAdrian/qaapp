import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('PetID')
    .setDescription('The PetID API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('PetID')
    .build();
  const document = SwaggerModule.createDocument(app, config);


  // app.useGlobalPipes(new ValidationPipe()); // Add ValidationPipe
  SwaggerModule.setup('api', app, document);
  await app.listen(8080); // Gateway listens on port 8080
}
bootstrap();