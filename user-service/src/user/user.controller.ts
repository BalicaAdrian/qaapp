import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserInterface } from './interfaces/createQuestionInterface.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(data: { id: string }): Promise<UserInterface> {
    return this.userService.getUserById(data.id);
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUser(data: UserInterface): Promise<UserInterface> {
    return this.userService.getUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: UserInterface): Promise<UserInterface> {
  
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'get_total_users' })
  async getTotalUsers(): Promise<number> {
    return await this.userService.getTotalUsers();

  }
}