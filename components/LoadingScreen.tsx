export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,250,255,0.96)_40%,_rgba(226,232,240,0.95)_100%)]" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center px-5 py-12">
        <div className="w-full space-y-6 rounded-[32px] border-2 border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
              <span className="material-symbols-outlined text-[32px]">school</span>
            </div>
          </div>

          <div className="space-y-3 text-center">
            <div className="mx-auto h-8 w-56 rounded-lg bg-surface-container-low animate-pulse" />
            <div className="mx-auto h-4 w-72 rounded-lg bg-surface-container-low animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-surface-container-low animate-pulse" />
            <div className="h-4 w-5/6 rounded-full bg-surface-container-low animate-pulse" />
            <div className="h-4 w-4/6 rounded-full bg-surface-container-low animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 rounded-xl bg-surface-container-low animate-pulse" />
            <div className="h-14 rounded-xl bg-surface-container-low animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-3 text-sm font-medium text-on-surface-variant">
            <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Loading...
          </div>
        </div>
      </main>
    </div>
  );
}
