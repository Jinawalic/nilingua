import { prisma } from "@/lib/prisma";

export async function GET() {
  const [languages, levels] = await Promise.all([
    prisma.$queryRaw<
      { slug: string; name: string; description: string | null }[]
    >`SELECT slug, name, description FROM "Language" ORDER BY id ASC`,
    prisma.$queryRaw<
      { slug: string; name: string; description: string | null }[]
    >`SELECT slug, name, description FROM "Level" ORDER BY id ASC`,
  ]);

  return Response.json({
    languages: languages.map((language) => ({
      id: language.slug,
      label: language.name,
      description: language.description || '',
    })),
    levels: levels.map((level) => ({
      id: level.slug,
      label: level.name,
      description: level.description || '',
    })),
  });
}
