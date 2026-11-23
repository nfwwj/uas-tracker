import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDTO } from './dto/user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor (private prismaService: PrismaService){}

    async createUser(data: createUserDTO){
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = await this.prismaService.user.create(
            {data:{
                username: data.username,
                email: data.email,
                passwordHash: hashedPassword
            }}
        )
        return user
    }
}
