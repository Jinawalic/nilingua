import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

type AdminSectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: { label: string; value: string }[];
};

export default function AdminSectionPage({
  eyebrow,
  title,
  description,
  highlights,
}: AdminSectionPageProps) {
  return (
    <div className="fixed inset-0 overflow-x-hidden bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_40%,rgba(241,243,249,1)_100%)]">
      <div className="flex h-full w-full min-w-0">
        <AdminSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/65">{eyebrow}</p>
                <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.05em] text-on-surface">{title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">{description}</p>
              </div>

              <Link
                href="/admin"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-medium text-on-surface-variant shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
              >
                Back to overview
              </Link>
            </header>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {highlights.map((item, index) => (
                <article
                  key={item.label}
                  className={`rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)] ${
                    index === 0 ? 'bg-primary text-white' : ''
                  }`}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${index === 0 ? 'text-white/75' : 'text-primary/65'}`}>
                    {item.label}
                  </p>
                  <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${index === 0 ? 'text-white' : 'text-on-surface'}`}>
                    {item.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Section workspace</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    This page is ready to host the full {title.toLowerCase()} management UI.
                  </p>
                </div>
                <span className="rounded-xl bg-primary-container px-4 py-2 text-sm font-semibold text-primary">
                  Professional admin shell
                </span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
