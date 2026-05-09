import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type LessonEntryPayload = {
  text?: unknown;
  meaning?: unknown;
};

type LessonRow = {
  id: number;
  language: string;
  level: string | null;
  lessonNumber: string | null;
  lessonTitle: string | null;
  word: string | null;
  meaning: string | null;
  entries: unknown;
  createdAt: Date;
  updatedAt: Date;
};

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEntries(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry: LessonEntryPayload) => ({
      text: toTrimmedString(entry?.text),
      meaning: toTrimmedString(entry?.meaning),
    }))
    .filter((entry) => entry.text.length > 0 || entry.meaning.length > 0);
}

function formatLesson(row: LessonRow) {
  return {
    id: row.id,
    language: row.language,
    level: row.level || "",
    lessonNumber: row.lessonNumber || "",
    lessonTitle: row.lessonTitle || "",
    word: row.word || "",
    meaning: row.meaning || "",
    entries: normalizeEntries(row.entries),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  const lessons = await prisma.$queryRaw<LessonRow[]>`
    SELECT
      id,
      language,
      level,
      "lessonNumber",
      "lessonTitle",
      word,
      meaning,
      entries,
      "createdAt",
      "updatedAt"
    FROM "Lesson"
    ORDER BY "updatedAt" DESC, id DESC
  `;

  return Response.json({
    lessons: lessons.map(formatLesson),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const language = toTrimmedString(body.language).toLowerCase();
    const level = toTrimmedString(body.level).toLowerCase();
    const lessonNumberInput = toTrimmedString(body.lessonNumber);
    const lessonTitle = toTrimmedString(body.lessonTitle);
    const entries = normalizeEntries(body.entries);

    if (!language || !level || !lessonNumberInput || !lessonTitle) {
      return Response.json(
        { message: "Language, level, lesson number, and lesson title are required." },
        { status: 400 },
      );
    }

    if (entries.length === 0) {
      return Response.json(
        { message: "At least one lesson entry is required." },
        { status: 400 },
      );
    }

    const [languageRecord, levelRecord] = await Promise.all([
      prisma.$queryRaw<{ id: number; name: string }[]>`
        SELECT id, name
        FROM "Language"
        WHERE slug = ${language}
        LIMIT 1
      `,
      prisma.$queryRaw<{ id: number; name: string }[]>`
        SELECT id, name
        FROM "Level"
        WHERE slug = ${level}
        LIMIT 1
      `,
    ]);

    if (languageRecord.length === 0 || levelRecord.length === 0) {
      return Response.json(
        { message: "Please select a valid language and level from the database." },
        { status: 400 },
      );
    }

    const lessonNumber = lessonNumberInput.padStart(2, "0");

    const existingLesson = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id
      FROM "Lesson"
      WHERE language = ${language}
        AND level = ${level}
        AND "lessonNumber" = ${lessonNumber}
      LIMIT 1
    `;

    if (existingLesson.length > 0) {
      return Response.json(
        { message: "A lesson with the same language, level, and lesson number already exists." },
        { status: 409 },
      );
    }

    const firstEntry = entries[0];
    const [lesson] = await prisma.$queryRaw<LessonRow[]>`
      INSERT INTO "Lesson" (
        language,
        level,
        "lessonNumber",
        "lessonTitle",
        word,
        meaning,
        entries
      )
      VALUES (
        ${language},
        ${level},
        ${lessonNumber},
        ${lessonTitle},
        ${firstEntry?.text || null},
        ${firstEntry?.meaning || null},
        ${JSON.stringify(entries)}::jsonb
      )
      RETURNING
        id,
        language,
        level,
        "lessonNumber",
        "lessonTitle",
        word,
        meaning,
        entries,
        "createdAt",
        "updatedAt"
    `;

    return Response.json(
      {
        message: "Lesson created successfully.",
        lesson: formatLesson(lesson),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin lesson create error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const lessonId = Number(body.lessonId);
    const language = toTrimmedString(body.language).toLowerCase();
    const level = toTrimmedString(body.level).toLowerCase();
    const lessonNumberInput = toTrimmedString(body.lessonNumber);
    const lessonTitle = toTrimmedString(body.lessonTitle);
    const entries = normalizeEntries(body.entries);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      return Response.json({ message: "A valid lesson id is required." }, { status: 400 });
    }

    if (!language || !level || !lessonNumberInput || !lessonTitle) {
      return Response.json(
        { message: "Language, level, lesson number, and lesson title are required." },
        { status: 400 },
      );
    }

    if (entries.length === 0) {
      return Response.json(
        { message: "At least one lesson entry is required." },
        { status: 400 },
      );
    }

    const [languageRecord, levelRecord] = await Promise.all([
      prisma.$queryRaw<{ id: number; name: string }[]>`
        SELECT id, name
        FROM "Language"
        WHERE slug = ${language}
        LIMIT 1
      `,
      prisma.$queryRaw<{ id: number; name: string }[]>`
        SELECT id, name
        FROM "Level"
        WHERE slug = ${level}
        LIMIT 1
      `,
    ]);

    if (languageRecord.length === 0 || levelRecord.length === 0) {
      return Response.json(
        { message: "Please select a valid language and level from the database." },
        { status: 400 },
      );
    }

    const lessonNumber = lessonNumberInput.padStart(2, "0");

    const duplicateLesson = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id
      FROM "Lesson"
      WHERE language = ${language}
        AND level = ${level}
        AND "lessonNumber" = ${lessonNumber}
        AND id <> ${lessonId}
      LIMIT 1
    `;

    if (duplicateLesson.length > 0) {
      return Response.json(
        { message: "A lesson with the same language, level, and lesson number already exists." },
        { status: 409 },
      );
    }

    const firstEntry = entries[0];
    const updatedLessons = await prisma.$queryRaw<LessonRow[]>`
      UPDATE "Lesson"
      SET
        language = ${language},
        level = ${level},
        "lessonNumber" = ${lessonNumber},
        "lessonTitle" = ${lessonTitle},
        word = ${firstEntry?.text || null},
        meaning = ${firstEntry?.meaning || null},
        entries = ${JSON.stringify(entries)}::jsonb,
        "updatedAt" = NOW()
      WHERE id = ${lessonId}
      RETURNING
        id,
        language,
        level,
        "lessonNumber",
        "lessonTitle",
        word,
        meaning,
        entries,
        "createdAt",
        "updatedAt"
    `;

    if (updatedLessons.length === 0) {
      return Response.json({ message: "Lesson not found." }, { status: 404 });
    }

    return Response.json({
      message: "Lesson updated successfully.",
      lesson: formatLesson(updatedLessons[0]),
    });
  } catch (error) {
    console.error("Admin lesson update error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const lessonIds = Array.isArray(body.lessonIds)
      ? body.lessonIds
          .map((value: unknown) => Number(value))
          .filter((value: number) => Number.isInteger(value) && value > 0)
      : [];

    if (lessonIds.length === 0) {
      return Response.json(
        { message: "At least one valid lesson id is required." },
        { status: 400 },
      );
    }

    const deletedLessons = await prisma.$queryRaw<LessonRow[]>`
      DELETE FROM "Lesson"
      WHERE id IN (${Prisma.join(lessonIds)})
      RETURNING
        id,
        language,
        level,
        "lessonNumber",
        "lessonTitle",
        word,
        meaning,
        entries,
        "createdAt",
        "updatedAt"
    `;

    return Response.json({
      message: "Lesson rows removed successfully.",
      deletedIds: deletedLessons.map((lesson) => lesson.id),
    });
  } catch (error) {
    console.error("Admin lesson delete error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
