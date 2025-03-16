import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
@ApiProperty({ description: 'The text of the answer' })
@IsString()
@MinLength(5)
@MaxLength(1000)
text: string;
}