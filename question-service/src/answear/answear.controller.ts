import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AnswearService } from './answear.service';
import { AnswearInterface } from './interfaces/answearInterface.interface';

@Controller()
export class AnswearController {
constructor(private readonly answearService: AnswearService) {}

@MessagePattern({ cmd: 'create_answear' })
async createAnswear(data: AnswearInterface): Promise<AnswearInterface> {
  return this.answearService.createAnswear(data);
}
}