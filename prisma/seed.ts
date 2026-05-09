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

    // await prisma.progress.deleteMany({});
    // await prisma.quiz.deleteMany({});
    // await prisma.lesson.deleteMany({});
    // await prisma.language.deleteMany({});
    // await prisma.level.deleteMany({});
    // await prisma.user.deleteMany({
    //     where: { email: "test@example.com" },
    // });

    console.log("Cleared old data.");

    const languages = await prisma.language.createMany({
        data: [
            {
                name: "Igbo",
                slug: "igbo",
                description: "Core greetings, vocabulary, and expressions.",
            },
            {
                name: "Yoruba",
                slug: "yoruba",
                description: "Practical language patterns for everyday use.",
            },
            {
                name: "Hausa",
                slug: "hausa",
                description: "Foundational lessons for common communication.",
            },
        ],
    });
    console.log(`Created ${languages.count} languages.`);

    const levels = await prisma.level.createMany({
        data: [
            {
                name: "Basic",
                slug: "basic",
                description: "Introduction, simple words, and phrases.",
            },
            {
                name: "Intermediate",
                slug: "intermediate",
                description: "Conversation, grammar, and sentence building.",
            },
            {
                name: "Advanced",
                slug: "advanced",
                description: "Idioms, context, and fluent usage.",
            },
        ],
    });
    console.log(`Created ${levels.count} levels.`);

    const lessons = await prisma.lesson.createMany({
        data: [
            {
                language: "igbo",
                level: "basic",
                lessonNumber: "01",
                lessonTitle: "Greetings and Introductions",
                word: "Ndewo",
                meaning: "Hello",
                entries: [
                    { text: "Ndewo", meaning: "Hello" },
                    { text: "Daalụ", meaning: "Thank you" },
                ],
            },
            {
                language: "yoruba",
                level: "basic",
                lessonNumber: "01",
                lessonTitle: "Greetings and Introductions",
                word: "Bawo",
                meaning: "Hello",
                entries: [
                    { text: "Bawo", meaning: "Hello" },
                    { text: "Ẹ kú àárọ̀", meaning: "Good morning" },
                ],
            },
            {
                language: "hausa",
                level: "basic",
                lessonNumber: "01",
                lessonTitle: "Greetings and Introductions",
                word: "Sannu",
                meaning: "Hello",
                entries: [
                    { text: "Sannu", meaning: "Hello" },
                    { text: "Na gode", meaning: "Thank you" },
                ],
            },
        ],
    });
    console.log(`Created ${lessons.count} lessons.`);

    const quizzes = await prisma.quiz.createMany({
        data: [
            {
                language: "igbo",
                level: "basic",
                question: "Which word means 'Hello' in Igbo?",
                optionA: "Daalụ",
                optionB: "Ndewo",
                optionC: "Ego",
                optionD: "Ụtụtụ",
                answer: "Ndewo",
            },
            {
                language: "yoruba",
                level: "basic",
                question: "Which word means 'Hello' in Yoruba?",
                optionA: "Bawo",
                optionB: "Káàárọ̀",
                optionC: "O dáa",
                optionD: "Ẹ ṣé",
                answer: "Bawo",
            },
            {
                language: "hausa",
                level: "basic",
                question: "Which word means 'Hello' in Hausa?",
                optionA: "Sannu",
                optionB: "Nagode",
                optionC: "Gida",
                optionD: "Aiki",
                answer: "Sannu",
            },
        ],
    });
    console.log(`Created ${quizzes.count} quizzes.`);

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
        await pool.end();
        console.log("🔌 Disconnected from database.");
    });
