import { ArrayNotEmpty, IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';


export class createUserDTO{
    @IsNotEmpty()
    username: string
    
    @IsEmail()
    email: string

    @IsNotEmpty() @MinLength(8)
    password: string
}

