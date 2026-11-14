import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';


async function main(){
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })


    const email = "test@gmail.com"
    const password = "password1"
    const username = "user1"

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
    data: { email: email, username: username, passwordHash: hashedPassword },
    })


    await prisma.$disconnect()

}

main()
