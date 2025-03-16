import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ description: 'The value of vote' })
  @IsBoolean()
  isUpVote: boolean;
}