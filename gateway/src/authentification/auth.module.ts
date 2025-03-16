import { Module } from '@nestjs/common';
import { AuthController } from './authentification.controller';
import { GoogleStrategy } from 'src/authentification/strategies/google.strategy';
import { SessionSerializer } from './utils/serializer';
import { AuthService } from './authenfitication.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


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
        GoogleStrategy,
        SessionSerializer,
        AuthService
    ],
})
export class AuthModule { }