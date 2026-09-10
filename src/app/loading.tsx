export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HERO SKELETON */}
      <div className="h-48 rounded-2xl bg-slate-200/60 border border-slate-200" />

      {/* SEARCH SKELETON */}
      <div className="h-14 rounded-2xl bg-slate-200/60 border border-slate-200" />

      {/* CARDS GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl bg-slate-200/60 border border-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200/60 border border-slate-200" />
      </div>
    </div>
  );
}
