import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'; import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OauthUserInterface } from './dtos/oAuthUserInterface.interface';
import { RegisterDto } from './dtos/registerDto.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from './dtos/loginDto';


@Injectable()
export class AuthService {
    constructor(
        @Inject('APP_SERVICE') private readonly appServiceClient: ClientProxy,
    ) { }


    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;
        console.log("dwadaw");

        const result = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'get_user_by_email' }, { email }),
        );
        console.log("result", result);
        if (result.id) {
            throw new BadRequestException('User already exists');
        }
        console.log("eaddcea")
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'create_user' }, { ...registerDto, password: hashedPassword }),
        );

        console.log("user create ", newUser)
        const secret = process.env.SECRET_JWT_KEY as string;
        console.log("SECA", secret)
        const token = jwt.sign({ id: newUser.id }, secret, {});

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
            token,
        };
    }

    public async login(
        userDto: LoginDto
    ) {
        const user = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'get_user_by_email' }, { email: userDto.email }),
        );
        console.log("user dwad ", user)
        if (user.status === HttpStatus.NOT_FOUND) {
            throw new NotFoundException('User not found');
        }

        const response = await bcrypt.compare(userDto.password, user.password);

        if (!response) {
            throw new BadRequestException('Wrong password');
        }

        const token = await jwt.sign({ id: user.id }, process.env.SECRET_JWT_KEY as string, {});

        return {
            user: user,
            token: token
        };
    }

    //google bug

    // async validateUser(details: OauthUserInterface) {
    //     const response = await firstValueFrom(
    //         this.appServiceClient.send({ cmd: 'get_user_by_email' }, { email: details.email }),
    //     );

    //     if (response.status === HttpStatus.NOT_FOUND) {
    //         const newUser = await firstValueFrom(
    //             this.appServiceClient.send({ cmd: 'create_user' }, details),
    //         );
    //         return newUser;
    //     }

    //     return response;
    // }

    async getUserById(id: string) {
        const user = await firstValueFrom(
            this.appServiceClient.send({ cmd: 'get_user_by_id' }, { id: id }),
        );
        return user;
    }
}