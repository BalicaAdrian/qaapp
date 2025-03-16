import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', // Use environment variables
      port: process.env.DB_PORT ? +process.env.DB_PORT : 3309,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'user_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Scan for entities
      synchronize: true, // Auto-create schema in dev
    }),
    UserModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }