import { prisma } from "@/lib/prisma";
import { getNextStep } from "@/lib/adaptive";

export async function POST(req: Request) {
    const { userId, lessonId, answers } = await req.json();

    const quizzes = await prisma.quiz.findMany({
        where: { id: lessonId },
    });

    let score = 0;

    quizzes.forEach((q, i) => {
        if (answers[i] === q.answer) {
            score++;
        }
    });

    const percentage = (score / quizzes.length) * 100;

    await prisma.progress.create({
        data: {
            userId,
            lessonId,
            score: percentage,
        },
    });

    const result = getNextStep(percentage);

    return Response.json({
        score: percentage,
        ...result,
    });
}