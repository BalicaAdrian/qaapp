import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ description: 'The content of the question' })
  @IsString()
  @MinLength(10)
  content: string;
}