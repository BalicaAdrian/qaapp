import { Controller, Get, Post, Inject, Param, Body, Res, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ResponseFactory } from 'src/factories/responseFactory';
import { CreateUserDto } from './dtos/createUserDto';

@ApiTags("users")
@Controller('users-service')
export class UserController {
  constructor(
    @Inject('APP_SERVICE') private readonly appServiceClient: ClientProxy,
    private readonly responseFactory: ResponseFactory,
  ) { }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    const user = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'get_user' }, { userId: id }),
    );
    return this.responseFactory.handleResponse(user, res);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await firstValueFrom(
      this.appServiceClient.send({ cmd: 'create_user' }, createUserDto),
    );
    return this.responseFactory.handleResponse(user, res); 
  }
}