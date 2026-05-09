import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type QuizOptionPayload = {
  a?: unknown;
  b?: unknown;
  c?: unknown;
  d?: unknown;
};

type QuizQuestionPayload = {
  question?: unknown;
  options?: QuizOptionPayload;
  correctOption?: unknown;
};

type QuizRow = {
  id: number;
  language: string | null;
  level: string | null;
  quizNumber: string | null;
  question: string | null;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  answer: string | null;
  questions: unknown;
  createdAt: Date;
  updatedAt: Date;
};

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function makeQuizId(language: string, level: string, quizNumber: string) {
  return `${language}-${level}-${quizNumber.trim().padStart(2, "0")}`.toLowerCase();
}

function normalizeQuestions(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item: QuizQuestionPayload) => {
      const question = toTrimmedString(item?.question);
      const options = item?.options ?? {};
      const a = toTrimmedString(options.a);
      const b = toTrimmedString(options.b);
      const c = toTrimmedString(options.c);
      const d = toTrimmedString(options.d);
      const correctOption = toTrimmedString(item?.correctOption).toUpperCase();

      return {
        question,
        options: { a, b, c, d },
        correctOption,
      };
    })
    .filter(
      (item) =>
        Boolean(item.question) &&
        Boolean(item.options.a) &&
        Boolean(item.options.b) &&
        Boolean(item.options.c) &&
        Boolean(item.options.d) &&
        ["A", "B", "C", "D"].includes(item.correctOption),
    );
}

function inferCorrectOption(row: QuizRow) {
  const answer = toTrimmedString(row.answer).toUpperCase();

  if (["A", "B", "C", "D"].includes(answer)) {
    return answer;
  }

  const optionMap = [
    ["A", row.optionA],
    ["B", row.optionB],
    ["C", row.optionC],
    ["D", row.optionD],
  ] as const;

  const matchingOption = optionMap.find(([, option]) => toTrimmedString(option) === toTrimmedString(row.answer));
  return matchingOption ? matchingOption[0] : "A";
}

function formatQuiz(row: QuizRow) {
  const normalizedQuestions = normalizeQuestions(row.questions);
  const fallbackQuestion =
    row.question && row.optionA && row.optionB && row.optionC && row.optionD
      ? [
          {
            question: row.question,
            options: {
              a: row.optionA,
              b: row.optionB,
              c: row.optionC,
              d: row.optionD,
            },
            correctOption: inferCorrectOption(row),
          },
        ]
      : [];
  const questions = normalizedQuestions.length > 0 ? normalizedQuestions : fallbackQuestion;

  return {
    dbId: row.id,
    id: makeQuizId(row.language || "", row.level || "", row.quizNumber || String(row.id)),
    language: row.language || "",
    level: row.level || "",
    quizNumber: row.quizNumber || "",
    question: row.question || "",
    optionA: row.optionA || "",
    optionB: row.optionB || "",
    optionC: row.optionC || "",
    optionD: row.optionD || "",
    answer: row.answer || "",
    questions,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function validateCatalogSelection(language: string, level: string) {
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

  return {
    languageValid: languageRecord.length > 0,
    levelValid: levelRecord.length > 0,
  };
}

export async function GET() {
  const quizzes = await prisma.$queryRaw<QuizRow[]>`
    SELECT
      id,
      language,
      level,
      "quizNumber",
      question,
      "optionA",
      "optionB",
      "optionC",
      "optionD",
      answer,
      questions,
      "createdAt",
      "updatedAt"
    FROM "Quiz"
    ORDER BY "updatedAt" DESC, id DESC
  `;

  return Response.json({
    quizzes: quizzes.map(formatQuiz),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const language = toTrimmedString(body.language).toLowerCase();
    const level = toTrimmedString(body.level).toLowerCase();
    const quizNumberInput = toTrimmedString(body.quizNumber);
    const questions = normalizeQuestions(body.questions);

    if (!language || !level || !questions.length) {
      return Response.json(
        { message: "Language, level, and at least one quiz question are required." },
        { status: 400 },
      );
    }

    const { languageValid, levelValid } = await validateCatalogSelection(language, level);

    if (!languageValid || !levelValid) {
      return Response.json(
        { message: "Please select a valid language and level from the database." },
        { status: 400 },
      );
    }

    const quizNumber = quizNumberInput || "01";

    const duplicateQuiz = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id
      FROM "Quiz"
      WHERE language = ${language}
        AND level = ${level}
        AND "quizNumber" = ${quizNumber}
      LIMIT 1
    `;

    if (duplicateQuiz.length > 0) {
      return Response.json(
        { message: "A quiz with the same language, level, and quiz number already exists." },
        { status: 409 },
      );
    }

    const firstQuestion = questions[0];
    const [quiz] = await prisma.$queryRaw<QuizRow[]>`
      INSERT INTO "Quiz" (
        language,
        level,
        "quizNumber",
        question,
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        answer,
        questions
      )
      VALUES (
        ${language},
        ${level},
        ${quizNumber},
        ${firstQuestion.question},
        ${firstQuestion.options.a},
        ${firstQuestion.options.b},
        ${firstQuestion.options.c},
        ${firstQuestion.options.d},
        ${firstQuestion.correctOption},
        ${JSON.stringify(questions)}::jsonb
      )
      RETURNING
        id,
        language,
        level,
        "quizNumber",
        question,
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        answer,
        questions,
        "createdAt",
        "updatedAt"
    `;

    return Response.json(
      {
        message: "Quiz created successfully.",
        quiz: formatQuiz(quiz),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin quiz create error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const quizId = Number(body.quizId);
    const language = toTrimmedString(body.language).toLowerCase();
    const level = toTrimmedString(body.level).toLowerCase();
    const quizNumberInput = toTrimmedString(body.quizNumber);
    const questions = normalizeQuestions(body.questions);

    if (!Number.isInteger(quizId) || quizId <= 0) {
      return Response.json({ message: "A valid quiz id is required." }, { status: 400 });
    }

    if (!language || !level || !questions.length) {
      return Response.json(
        { message: "Language, level, and at least one quiz question are required." },
        { status: 400 },
      );
    }

    const { languageValid, levelValid } = await validateCatalogSelection(language, level);

    if (!languageValid || !levelValid) {
      return Response.json(
        { message: "Please select a valid language and level from the database." },
        { status: 400 },
      );
    }

    const quizNumber = quizNumberInput || "01";

    const duplicateQuiz = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id
      FROM "Quiz"
      WHERE language = ${language}
        AND level = ${level}
        AND "quizNumber" = ${quizNumber}
        AND id <> ${quizId}
      LIMIT 1
    `;

    if (duplicateQuiz.length > 0) {
      return Response.json(
        { message: "A quiz with the same language, level, and quiz number already exists." },
        { status: 409 },
      );
    }

    const firstQuestion = questions[0];
    const updatedQuizzes = await prisma.$queryRaw<QuizRow[]>`
      UPDATE "Quiz"
      SET
        language = ${language},
        level = ${level},
        "quizNumber" = ${quizNumber},
        question = ${firstQuestion.question},
        "optionA" = ${firstQuestion.options.a},
        "optionB" = ${firstQuestion.options.b},
        "optionC" = ${firstQuestion.options.c},
        "optionD" = ${firstQuestion.options.d},
        answer = ${firstQuestion.correctOption},
        questions = ${JSON.stringify(questions)}::jsonb,
        "updatedAt" = NOW()
      WHERE id = ${quizId}
      RETURNING
        id,
        language,
        level,
        "quizNumber",
        question,
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        answer,
        questions,
        "createdAt",
        "updatedAt"
    `;

    if (updatedQuizzes.length === 0) {
      return Response.json({ message: "Quiz not found." }, { status: 404 });
    }

    return Response.json({
      message: "Quiz updated successfully.",
      quiz: formatQuiz(updatedQuizzes[0]),
    });
  } catch (error) {
    console.error("Admin quiz update error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const quizIds = Array.isArray(body.quizIds)
      ? body.quizIds
          .map((value: unknown) => Number(value))
          .filter((value: number) => Number.isInteger(value) && value > 0)
      : [];

    if (quizIds.length === 0) {
      return Response.json(
        { message: "At least one valid quiz id is required." },
        { status: 400 },
      );
    }

    const deletedQuizzes = await prisma.$queryRaw<QuizRow[]>`
      DELETE FROM "Quiz"
      WHERE id IN (${Prisma.join(quizIds)})
      RETURNING
        id,
        language,
        level,
        "quizNumber",
        question,
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        answer,
        questions,
        "createdAt",
        "updatedAt"
    `;

    return Response.json({
      message: "Quiz rows removed successfully.",
      deletedIds: deletedQuizzes.map((quiz) => quiz.id),
    });
  } catch (error) {
    console.error("Admin quiz delete error:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
