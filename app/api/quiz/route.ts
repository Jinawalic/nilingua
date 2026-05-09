import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const language = url.searchParams.get("language");
    const level = url.searchParams.get("level");

    const where: any = {};
    if (language) {
        where.language = language;
    }
    if (level) {
        where.level = level;
    }

    const quiz = await prisma.quiz.findMany({
        where,
        orderBy: [{ quizNumber: "asc" }, { id: "asc" }],
    });

    return Response.json(quiz);
}

export async function POST(req: Request) {
    const { question, optionA, optionB, optionC, optionD, answer } =
        await req.json();

    const quiz = await prisma.quiz.create({
        data: {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            answer,
        },
    });

    return Response.json(quiz);
}