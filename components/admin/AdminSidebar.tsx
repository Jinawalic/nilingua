"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarItem = {
  icon: string;
  label: string;
  href: string;
};

const dashboardItems: SidebarItem[] = [
  { icon: 'dashboard', label: 'Overview', href: '/admin' },
  { icon: 'menu_book', label: 'Lessons', href: '/admin/lessons' },
  { icon: 'quiz', label: 'Quizzes', href: '/admin/quizzes' },
  { icon: 'translate', label: 'Vocabulary', href: '/admin/vocabulary' },
  { icon: 'trending_up', label: 'Progress', href: '/admin/progress' },
  { icon: 'person', label: 'Profile', href: '/admin/profile' },
];

function SidebarLink({ icon, label, href }: SidebarItem) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors ${
        active
          ? 'bg-primary-container text-primary shadow-[inset_0_0_0_1px_rgba(38,65,145,0.12)]'
          : 'text-on-surface-variant hover:bg-surface-container-low'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <span className={`material-symbols-outlined text-[24px] ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
        {icon}
      </span>
      <span className={`text-lg font-medium ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="flex h-full w-[322px] shrink-0 flex-col border-r border-outline-variant/70 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined text-[24px]">cottage</span>
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/65">Admin</p>
            <h1 className="text-[25px] font-bold tracking-[-0.04em] text-on-surface">Nilingua</h1>
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary"
          aria-label="Sidebar menu"
        >
          <span className="material-symbols-outlined text-[28px]">menu</span>
        </button>
      </div>

      <nav className="flex flex-1 flex-col">
        <section className="border-b border-outline-variant/70">
          <div className="mt-1 space-y-1">
            {dashboardItems.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}
          </div>

          <div className="mt-1 space-y-1">
            <Link
              href="/login"
              className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant">logout</span>
              <span className="text-lg font-medium">Logout</span>
            </Link>
          </div>
        </section>
      </nav>
    </aside>
  );
}
