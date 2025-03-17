import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

 // dto/login.dto.ts
 export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsNotEmpty()
    password: string;
    }