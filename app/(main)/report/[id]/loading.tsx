export default function ReportDetailLoading() {
  return (
    <div className="animate-pulse mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center py-12 gap-4">
        <div className="h-16 w-24 rounded-xl bg-overlay" />
        <div className="h-6 w-32 rounded-full bg-overlay" />
        <div className="h-4 w-96 max-w-full rounded bg-overlay" />
        <div className="h-3 w-64 rounded bg-overlay" />
      </div>
      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        <div className="h-6 w-48 rounded bg-overlay" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-overlay" />
        ))}
      </div>
    </div>
  );
}
