import { prisma } from "@/lib/prisma";
import { getNextStep } from "@/lib/adaptive";
import type { Quiz } from "@prisma/client";

export async function POST(req: Request) {
    const { userId, lessonId, answers } = await req.json();

    // Since Quiz model doesn't have lessonId, get all quizzes
    // In a real app, you'd want to associate quizzes with lessons
    const quizzes = await prisma.quiz.findMany();

    let score = 0;

    quizzes.forEach((q: Quiz, i) => {
        if (answers[i] && answers[i] === q.answer) {
            score++;
        }
    });

    const percentage = quizzes.length > 0 ? (score / Math.min(answers.length, quizzes.length)) * 100 : 0;

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