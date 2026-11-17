import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";
import * as bcrypt from 'bcrypt'


const connectionString = `${process.env.DATABASE_URL}`;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  const passwordHash = await bcrypt.hash("password", 12)

  const user = await prisma.user.upsert({
    where: { email: 'email' },
    update: {},
    create: { username: 'username', email: 'email', passwordHash },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())