import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId, lessonId, score } = await req.json();

    const progress = await prisma.progress.create({
        data: {
            userId,
            lessonId,
            score,
        },
    });

    return Response.json(progress);
}