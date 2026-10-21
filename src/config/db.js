import { PrismaClient } from "@prisma/client";

//Prisma client

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

//connect to db

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("DB connected via prisma")
    } catch (error) {
        console.error(`Database connection error ${error.message}`)
        process.exit(1)
    }
}

//disconnect from db

const disconnectDB = async () => {
    await prisma.$disconnect()
}

export { prisma, connectDB, disconnectDB }