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
    console.log("Removing seed lessons (15, 16, 17)...");
    const deletedLessons = await prisma.lesson.deleteMany({
        where: {
            id: { in: [15, 16, 17] }
        }
    });
    console.log(`Deleted ${deletedLessons.count} lessons.`);

    console.log("Removing seed quizzes (8, 9, 10)...");
    const deletedQuizzes = await prisma.quiz.deleteMany({
        where: {
            id: { in: [8, 9, 10] }
        }
    });
    console.log(`Deleted ${deletedQuizzes.count} quizzes.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
