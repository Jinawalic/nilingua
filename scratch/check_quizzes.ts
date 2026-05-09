import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: true,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const quizzes = await prisma.quiz.findMany();
    console.log("Total quizzes in database:", quizzes.length);
    console.log(JSON.stringify(quizzes, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
