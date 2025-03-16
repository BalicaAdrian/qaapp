import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { VoteService } from './vote.service';
import { VoteInterface } from './interfaces/voteInterface.interface';
import { Vote } from './vote.entity';

@Controller()
export class VoteController {
  constructor(private readonly voteService: VoteService) { }

  @MessagePattern({ cmd: 'vote_question' })
  async voteQuestion(data: VoteInterface): Promise<VoteInterface> {
    return this.voteService.voteQuestion(data);
  }

  @MessagePattern({ cmd: 'vote_asnwear' })
  async voteAnswear(data: VoteInterface): Promise<VoteInterface> {
    return this.voteService.voteAnswear(data);
  }
}