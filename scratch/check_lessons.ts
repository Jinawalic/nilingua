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
    const lessons = await prisma.lesson.findMany();
    console.log("Total lessons in database:", lessons.length);
    console.log(JSON.stringify(lessons, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
