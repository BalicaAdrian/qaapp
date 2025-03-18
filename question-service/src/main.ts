import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.QUESTION_SERVICE_PORT ? +process.env.QUESTION_SERVICE_PORT : 3002,
    },
  });
  app.listen();
}
bootstrap();