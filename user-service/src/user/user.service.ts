import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateUserInterface } from './interfaces/createQuestionInterface.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getTotalUsers(): Promise<number> {
    try {
      const total = await this.userRepository.count();
      return total;

    } catch (error) {
      throw new RpcException({ message: 'Failed to calculate users', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

}