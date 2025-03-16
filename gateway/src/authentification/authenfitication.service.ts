import { HttpStatus, Inject, Injectable } from '@nestjs/common'; import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OauthUserInterface } from './dtos/oAuthUserInterface.interface';
;

@Injectable()
export class AuthService {
    constructor(
        @Inject('APP_SERVICE') private readonly appServiceClient: ClientProxy,
    ) { }

    async checkUser(details: OauthUserInterface) {
        const response = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'get_user_by_email' }, { email: details.email }),
        );
    
        if (response.status === HttpStatus.NOT_FOUND) {
            const newUser = await firstValueFrom(
                this.appServiceClient.send({ cmd: 'create_user' }, details),
            );
            return newUser;
        }
      
        return response;
    }

    async getUserById(id: string) {
        const user = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'get_user_by_id' }, { id: id }),
        );
        return user;
    }
}