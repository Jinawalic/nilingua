import { prisma } from "@/lib/prisma";

export async function GET() {
    const quiz = await prisma.quiz.findMany();

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