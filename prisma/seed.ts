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
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.progress.deleteMany({});
    await prisma.quiz.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.user.deleteMany({
        where: { email: "test@example.com" }
    });

    console.log("Cleared old data.");

    // Seed Lessons
    const lessons = await prisma.lesson.createMany({
        data: [
            { language: "Spanish", word: "Hola", meaning: "Hello" },
            { language: "Spanish", word: "Gracias", meaning: "Thank you" },
            { language: "French", word: "Bonjour", meaning: "Hello" },
            { language: "French", word: "Merci", meaning: "Thank you" },
            { language: "German", word: "Hallo", meaning: "Hello" },
        ],
    });
    console.log(`Created ${lessons.count} lessons.`);

    // Seed Quizzes
    const quizzes = await prisma.quiz.createMany({
        data: [
            {
                question: "What does 'Hola' mean in English?",
                optionA: "Goodbye",
                optionB: "Hello",
                optionC: "Thank you",
                optionD: "Please",
                answer: "Hello",
            },
            {
                question: "What does 'Merci' mean in English?",
                optionA: "Please",
                optionB: "Sorry",
                optionC: "Thank you",
                optionD: "Goodbye",
                answer: "Thank you",
            },
            {
                question: "Which word means 'Hello' in French?",
                optionA: "Bonjour",
                optionB: "Salut",
                optionC: "Merci",
                optionD: "Oui",
                answer: "Bonjour",
            }
        ],
    });
    console.log(`Created ${quizzes.count} quizzes.`);

    // Seed Test User
    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: "test@example.com",
            password: "password123", 
        },
    });
    console.log(`Created test user: ${user.email}`);

    console.log("✅ Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 Disconnected from database.");
    });
