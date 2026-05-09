import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const language = url.searchParams.get("language");
        const level = url.searchParams.get("level");
        const lessonId = url.searchParams.get("lessonId") ?? url.searchParams.get("lesson");

        const where: any = {};

        if (lessonId) {
            const parsedId = Number(lessonId);
            if (!Number.isNaN(parsedId)) {
                where.id = parsedId;
            }
        } else {
            if (language) {
                where.language = language;
            }
            if (level) {
                where.level = level;
            }
        }

        const lessons = await prisma.lesson.findMany({
            where,
            orderBy: [{ lessonNumber: "asc" }, { id: "asc" }],
        });

        return Response.json(lessons);
    } catch (error: unknown) {
        console.error("Failed to fetch lessons:", error);
        return Response.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    const body = await req.json();

    const lesson = await prisma.lesson.create({
        data: body,
    });

    return Response.json(lesson);
}