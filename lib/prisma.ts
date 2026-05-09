import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is not defined. Create a .env file or set DATABASE_URL in your environment before running the app."
    );
}

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production",
});
const adapter = new PrismaPg(pool);

function hasCurrentModels(client: PrismaClient | undefined): client is PrismaClient {
    return Boolean(
        client &&
            typeof (client as PrismaClient & {
                language?: { findMany?: unknown };
                level?: { findMany?: unknown };
            }).language?.findMany === "function" &&
            typeof (client as PrismaClient & {
                language?: { findMany?: unknown };
                level?: { findMany?: unknown };
            }).level?.findMany === "function",
    );
}

const cachedPrisma = globalForPrisma.prisma;

export const prisma = hasCurrentModels(cachedPrisma)
    ? cachedPrisma
    : new PrismaClient({
          adapter,
      });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
