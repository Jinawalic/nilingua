import { prisma } from '@/lib/prisma';
import AdminDashboardShell from '@/components/admin/AdminDashboardShell';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [lessons, quizzes, users] = await Promise.all([
    prisma.lesson.findMany({
      orderBy: { id: 'desc' },
    }),
    prisma.quiz.findMany({
      orderBy: { id: 'desc' },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { id: 'desc' },
    }),
  ]);

  const languageBreakdown = lessons.reduce<Record<string, number>>((acc, lesson) => {
    const key = lesson.language || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminDashboardShell
      lessonCount={lessons.length}
      quizCount={quizzes.length}
      userCount={users.length}
      latestUserName={users[0]?.name}
      languageBreakdown={Object.entries(languageBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([language, count]) => ({ language, count }))}
    />
  );
}
