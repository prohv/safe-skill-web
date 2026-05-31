export default function ReportsLoading() {
  return (
    <div className="animate-pulse mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="h-8 w-28 rounded-lg bg-overlay mb-6" />
      <div className="space-y-3">
        <div className="h-8 w-full rounded-lg bg-overlay" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-overlay" />
        ))}
      </div>
    </div>
  );
}
