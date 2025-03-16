import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name: string;
  
    @ApiProperty()
    @IsEmail()
    email: string;
  }