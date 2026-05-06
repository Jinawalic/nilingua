import { prisma } from "@/lib/prisma";

export async function GET() {
    const lessons = await prisma.lesson.findMany();

    return Response.json(lessons);
}

export async function POST(req: Request) {
    const body = await req.json();

    const lesson = await prisma.lesson.create({
        data: body,
    });

    return Response.json(lesson);
}