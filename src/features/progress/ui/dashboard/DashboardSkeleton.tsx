export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="h-16 border-b border-slate-200" />
      <div className="relative w-full bg-slate-50 overflow-hidden">
        <div aria-hidden className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/20 blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute top-10 right-[-6rem] w-96 h-96 rounded-full bg-purple-400/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-4">
          <div className="relative overflow-hidden h-4 w-40 rounded bg-slate-200">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
          <div className="relative overflow-hidden h-10 w-2/3 rounded bg-slate-200">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
          <div className="relative overflow-hidden h-4 w-1/2 rounded bg-slate-200">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </div>
      {[0, 1, 2].map((s) => (
        <div key={s} className={`w-full ${s % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-3">
            <div className="relative overflow-hidden h-5 w-56 rounded bg-slate-200">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
            <div className="relative overflow-hidden h-4 w-full rounded bg-slate-200">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
            <div className="relative overflow-hidden h-4 w-5/6 rounded bg-slate-200">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
          </div>
        </div>
      ))}
      <p className="sr-only">Đang đồng bộ dữ liệu học tập...</p>
    </div>
  );
}
