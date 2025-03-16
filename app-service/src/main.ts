import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0', // Listen on all interfaces within the container
    port: 3000, // Choose a port for the app service
  },
});
app.listen();
}
bootstrap();