type SidebarItem = {
  icon: string;
  label: string;
  active?: boolean;
};

const dashboardItems: SidebarItem[] = [
  { icon: 'dashboard', label: 'Overview', active: true },
  { icon: 'menu_book', label: 'Lessons' },
  { icon: 'quiz', label: 'Quizzes' },
  { icon: 'translate', label: 'Vocabulary' },
  { icon: 'trending_up', label: 'Progress' },
  { icon: 'person', label: 'Profile' },
  { icon: 'logout', label: 'Logout' },
];

function SidebarLink({ icon, label, active = false }: SidebarItem) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors ${
        active ? 'bg-primary-container text-primary shadow-[inset_0_0_0_1px_rgba(38,65,145,0.12)]' : 'text-on-surface-variant hover:bg-surface-container-low'
      }`}
      aria-pressed={active}
    >
      <span className={`material-symbols-outlined text-[24px] ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{icon}</span>
      <span className={`text-lg font-medium ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
    </button>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="flex h-full w-[322px] shrink-0 flex-col border-r border-outline-variant/70 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white]">
            <span className="material-symbols-outlined text-[24px]">cottage</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/65">Admin</p>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-on-surface">Nilingua</h1>
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
        <section className="border-b border-outline-variant/70 pb-6">
          <div className="mt-5 space-y-1">
            {dashboardItems.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}
          </div>      
        </section>
      </nav>
    </aside>
  );
}
