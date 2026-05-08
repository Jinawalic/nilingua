import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStatCard from '@/components/admin/AdminStatCard';
import RecentRegisteredTable from './RecentRegisteredTable';

type LanguageBreakdown = {
  language: string;
  count: number;
};

type AdminDashboardShellProps = {
  lessonCount: number;
  quizCount: number;
  userCount: number;
  latestUserName?: string;
  languageBreakdown: LanguageBreakdown[];
};

const chartDays = [
  { label: 'Mon', value: 36 },
  { label: 'Tue', value: 62 },
  { label: 'Wed', value: 44 },
  { label: 'Thu', value: 39 },
  { label: 'Fri', value: 84 },
  { label: 'Sat', value: 60 },
  { label: 'Sun', value: 48 },
];

function formatLegendCount(count: number) {
  if (count >= 100) {
    return '100+';
  }

  return String(count);
}

export default function AdminDashboardShell({
  lessonCount,
  quizCount,
  userCount,
  latestUserName,
  languageBreakdown,
}: AdminDashboardShellProps) {
  const languageCount = languageBreakdown.length;
  const totalContent = lessonCount + quizCount;
  const highlightValue = latestUserName || 'No users yet';
  const chartTopValue = Math.max(lessonCount, quizCount, userCount, 1) + 40;
  const topLanguage = languageBreakdown[0];
  const summaryCards = [
    {
      title: 'Top Language',
      value: topLanguage?.language || 'N/A',
      subtitle: topLanguage ? `${topLanguage.count} lessons tracked` : 'No lesson data yet',
      icon: 'language',
    },
    {
      title: 'Content Total',
      value: String(totalContent),
      subtitle: 'Lessons + quizzes combined',
      icon: 'stacked_line_chart',
    },
  ];

  const legendItems =
    languageBreakdown.length > 0
      ? languageBreakdown.map((entry, index) => ({
          ...entry,
          color: ['#264191', '#5c7cf5', '#9aa8ff', '#c8d1ff'][index % 4],
        }))
      : [
          { language: 'Lessons', count: lessonCount, color: '#264191' },
          { language: 'Quizzes', count: quizCount, color: '#5c7cf5' },
          { language: 'Users', count: userCount, color: '#9aa8ff' },
        ];

  const donutGradient =
    legendItems.length > 0
      ? `conic-gradient(${legendItems
          .map((item, index) => {
            const total = legendItems.reduce((sum, current) => sum + current.count, 0) || 1;
            const start = legendItems.slice(0, index).reduce((sum, current) => sum + current.count, 0);
            const startPercent = (start / total) * 100;
            const endPercent = ((start + item.count) / total) * 100;

            return `${item.color} ${startPercent.toFixed(2)}% ${endPercent.toFixed(2)}%`;
          })
          .join(', ')})`
      : 'conic-gradient(#264191 0% 34%, #5c7cf5 34% 66%, #9aa8ff 66% 100%)';

  return (
    <div className="fixed inset-0 overflow-x-hidden bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_40%,rgba(241,243,249,1)_100%)]">
      <div className="flex h-full w-full min-w-0">
        <AdminSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col gap-6 min-w-0">
            <header className="flex items-start justify-between gap-4">
              <div>
                {/* <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/65">Overview</p> */}
                <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.05em] text-on-surface">Admin dashboard</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  A clean, desktop-first workspace for monitoring Nilingua lessons, quizzes, vocabulary, and learner progress.
                </p>
              </div>

              <div className="text-right]">
                <img src="/images/welcome-img.png" style={{ width: 40, height: 40, borderRadius: '50%' }} alt="" />
              </div>
            </header>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard
                title="Lessons"
                value={String(lessonCount)}
                subtitle="Published learning units"
                icon="menu_book"
                highlighted
              />
              <AdminStatCard
                title="Quizzes"
                value={String(quizCount)}
                subtitle="Assessment items available"
                icon="quiz"
              />
              <AdminStatCard
                title="Users"
                value={String(userCount)}
                subtitle="Active learners"
                icon="person_add"
              />
              <AdminStatCard
                title="Languages"
                value={String(languageCount)}
                subtitle="Tracked language groups"
                icon="language"
              />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="flex flex-row gap-5">
                <article className="rounded-xl border border-outline-variant bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-[-0.03em] text-on-surface">Lesson Breakdown</h3>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-xl border border-outline-variant bg-surface px-2 py-1 text-sm font-semibold text-primary"
                    >
                      Today
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                  </div>

                  <div className="mt-7 flex justify-center">
                    <div className="relative h-36 w-36">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: donutGradient }}
                      />
                      <div className="absolute inset-10 rounded-full border border-outline-variant/70 bg-surface" />
                      <div className="absolute inset-16 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(36,65,145,0.05)]" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {legendItems.map((item) => (
                      <div key={item.language} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-on-surface-variant">{item.language}</span>
                        </div>
                        <span className="rounded-full bg-surface-container-low px-3 py-1 text-sm font-medium text-on-surface-variant">
                          {formatLegendCount(item.count)}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="min-w-0 rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold tracking-[-0.03em] text-on-surface">Content Performance</h3>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant"
                    aria-label="Performance options"
                  >
                    <span className="material-symbols-outlined text-[22px]">menu</span>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 min-w-0">
                  {summaryCards.map((card, index) => (
                    <AdminStatCard
                      key={card.title}
                      title={card.title}
                      value={card.value}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      compact
                      highlighted={index === 0}
                    />
                  ))}
                </div>

                <div className="mt-8 rounded-xl border border-outline-variant bg-surface/75 p-5">
                  <div className="flex items-center justify-between text-sm text-on-surface-variant">
                    <span>Weekly activity</span>
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-primary">
                      {highlightValue}
                    </span>
                  </div>

                  <div className="mt-6 flex h-[300px] items-end gap-1 overflow-hidden">
                    {chartDays.map((day, index) => {
                      const lowerBand = Math.max(18, Math.round((day.value / chartTopValue) * 120));
                      const upperBand = Math.max(14, Math.round((day.value / chartTopValue) * 88));
                      const totalHeight = Math.max(92, Math.round((day.value / chartTopValue) * 230));

                      return (
                        <div key={day.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                          <div className="relative flex h-full w-full items-end justify-center rounded-xl">
                            <div className="flex h-[200px] w-full max-w-[28px] items-end justify-center">
                              <div
                                className="flex w-full flex-col-reverse overflow-hidden rounded-xl border border-outline-variant/60 bg-white "
                                style={{ height: `${totalHeight}px` }}
                              >
                                <div className="w-full bg-primary/85" style={{ height: `${lowerBand}px` }} />
                                <div className="w-full bg-primary-container" style={{ height: `${upperBand}px` }} />
                              </div>
                            </div>

                            {index === 4 && (
                              <div className="absolute top-0 -translate-y-2 rounded-xl bg-white px-3 py-2 text-[11px] font-medium text-on-surface-variant ">
                                Fri
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-on-surface-variant">{day.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
              </div>
                  <RecentRegisteredTable users={[]} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
