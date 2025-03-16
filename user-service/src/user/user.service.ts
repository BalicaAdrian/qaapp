import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { UserInterface } from './interfaces/createQuestionInterface.interface';
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

  async getUserById(userId: string): Promise<UserInterface> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new RpcException({ message: 'User not found', status: HttpStatus.NOT_FOUND });
      }
      return user;

    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch user",
      });
    }
  }

  async getUserByEmail(email: string): Promise<UserInterface> {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new RpcException({ message: 'User not found', status: HttpStatus.NOT_FOUND });
      }
      return user;

    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error in getting user",
      });
    }
  }

  async createUser(data: UserInterface): Promise<UserInterface> {
    try {
      const newUser = this.userRepository.save(data);
      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new RpcException({ message: 'Failed to create user', status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

}