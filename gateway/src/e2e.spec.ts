// test/e2e/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user-service/src/user/user.entity';
import { Question } from '../../question-service/src/question/question.entity';
import { Answear } from '../../question-service/src/answear/answear.entity';
import { Vote } from '../../question-service/src/vote/vote.entity';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from "../../app-service/src/app.module"
import { AppModule as UserModule } from "../../user-service/src/app.module"
import { AppModule as QuestionModule } from "../../question-service/src/app.module"
import { ResponseFactory } from './factories/responseFactory';
import { RegisterDto } from './authentification/dtos/registerDto.dto';
import { LoginDto } from './authentification/dtos/loginDto';
import { CreateQuestionDto } from './question/dtos/createQuestionDto.dto';
import { CreateAnswerDto } from './question/dtos/createNaswearDto';

describe('E2E Tests', () => {
    let gatewayApp: INestApplication;
    let appServiceApp: INestApplication;
    let userServiceApp: INestApplication;
    let questionServiceApp: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const userModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User],
                    synchronize: true,
                    dropSchema: true,
                }),
                TypeOrmModule.forFeature([User]),
                UserModule
            ],
        }).compile();

        userServiceApp = userModule.createNestApplication();
        userServiceApp.connectMicroservice({
            transport: Transport.TCP,
            options: { port: 3002 },
        });
        await userServiceApp.startAllMicroservices();
        await userServiceApp.init();

        const questionModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [Question, Answear, Vote],
                    synchronize: true,
                    dropSchema: true,
                }),
                TypeOrmModule.forFeature([Question, Answear, Vote]),
                QuestionModule
            ],
        }).compile();

        questionServiceApp = questionModule.createNestApplication();
        questionServiceApp.connectMicroservice({
            transport: Transport.TCP,
            options: { port: 3003 },
        });
        await questionServiceApp.startAllMicroservices();
        await questionServiceApp.init();

        const appModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'USER_SERVICE',
                        transport: Transport.TCP,
                        options: { port: 3002 },
                    },
                    {
                        name: 'QUESTION_SERVICE',
                        transport: Transport.TCP,
                        options: { port: 3003 },
                    },
                ]),
                AppModule
            ],
        }).compile();

        appServiceApp = appModule.createNestApplication();
        appServiceApp.connectMicroservice({
            transport: Transport.TCP,
            options: { port: 3001 },
        });
        await appServiceApp.startAllMicroservices();
        await appServiceApp.init();


        const gatewayModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'APP_SERVICE',
                        transport: Transport.TCP,
                        options: { port: 3001 },
                    },
                ]),

            ],
            providers: [ResponseFactory, JwtService],
        }).compile();

        gatewayApp = gatewayModule.createNestApplication();
        gatewayApp.useGlobalPipes(new ValidationPipe());
        await gatewayApp.init();
    });

    afterAll(async () => {
        await gatewayApp.close();
        await appServiceApp.close();
        await userServiceApp.close();
        await questionServiceApp.close();
    });

    describe('Auth Flow', () => {
        const registerDto: RegisterDto = {
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User',
        };

        const loginDto: LoginDto = {
            email: 'test@example.com',
            password: 'Password123!',
        };

        it('should register a new user', () => {
            return request(gatewayApp.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data).toBeDefined();
                    expect(res.body.meta.statusCode).toBe(201);
                });
        });

        it('should login and return token', () => {
            return request(gatewayApp.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.token).toBeDefined();
                    authToken = res.body.data.token;
                });
        });
    });

    describe('Question Flow', () => {
        let questionId: string;
        let answerId: string;

        const questionDto: CreateQuestionDto = {
            content: 'This is a test question with proper length?',
        };

        it('should create a question', () => {
            return request(gatewayApp.getHttpServer())
                .post('/question-service')
                .set('Authorization', `Bearer ${authToken}`)
                .send(questionDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.id).toBeDefined();
                    questionId = res.body.data.id;
                });
        });

        it('should create an answer', () => {
            const answerDto: CreateAnswerDto = {
                text: 'This is a test answer with proper length',
            };

            return request(gatewayApp.getHttpServer())
                .post(`/question-service/${questionId}/answers`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(answerDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.id).toBeDefined();
                    answerId = res.body.data.id;
                });
        });

    });

});