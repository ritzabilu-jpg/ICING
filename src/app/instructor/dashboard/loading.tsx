export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header skeleton */}
      <div className="bg-[#0f2942] py-5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3 animate-pulse">
          <div className="space-y-2">
            <div className="h-7 bg-[#1a3a5c] rounded w-36" />
            <div className="h-4 bg-[#1a3a5c] rounded w-24" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1a3a5c] rounded-xl px-4 py-2 w-24 h-14" />
            ))}
          </div>
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="bg-white border-b border-slate-200 h-12 animate-pulse">
        <div className="max-w-4xl mx-auto flex gap-4 px-4 items-center h-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-4 bg-slate-100 rounded w-20" />
          ))}
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex gap-2 mb-3">
              <div className="h-5 bg-slate-100 rounded-full w-14" />
              <div className="h-5 bg-slate-100 rounded-full w-16" />
            </div>
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
