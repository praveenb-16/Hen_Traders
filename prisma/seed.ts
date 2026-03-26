import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!passwordHash) {
    console.error('Please set ADMIN_PASSWORD_HASH in your .env file')
    process.exit(1)
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    console.log('Admin user already exists')
    return
  }

  await prisma.user.create({
    data: {
      username,
      password: passwordHash,
    },
  })

  console.log('Admin user created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })