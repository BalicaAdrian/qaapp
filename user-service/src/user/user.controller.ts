import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInterface } from './interfaces/createQuestionInterface.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(data: { userId: string }): Promise<User | null> {
    const userId = data.userId;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user)
      return user;
    return null;
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: CreateUserInterface): Promise<User> {
    const newUser = this.userRepository.create({
      name: data.name,
      email: data.email,
    });
    const user = await this.userRepository.save(newUser);
    return user;
  }

  @MessagePattern({ cmd: 'get_total_users' })
  async getTotalUsers(): Promise<number> {
    return await this.userService.getTotalUsers();
    
  }
}