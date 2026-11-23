import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';

export class LoginUserDTO{
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}


export interface AuthUser {
  userId: number
  username: string
  sid: string
}

