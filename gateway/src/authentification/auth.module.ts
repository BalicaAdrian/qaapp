import { Module } from '@nestjs/common';
import { AuthController } from './authentification.controller';
//import { GoogleStrategy } from 'src/authentification/strategies/google.strategy'; //google bug
import { SessionSerializer } from './utils/serializer';
import { AuthService } from './authenfitication.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResponseFactory } from 'src/factories/responseFactory';


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
        ]),],
    controllers: [AuthController],
    providers: [
        //GoogleStrategy, //google bug
        SessionSerializer,
        AuthService,
        ResponseFactory
    ],
})
export class AuthModule { }