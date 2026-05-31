export default function MarketplaceLoading() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto w-full max-w-screen-xl flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3">
        <div className="h-10 w-20 rounded-xl bg-overlay shrink-0" />
        <div className="flex-1 h-10 rounded-xl bg-overlay max-w-sm" />
        <div className="h-10 w-24 rounded-xl bg-overlay shrink-0" />
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 py-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="h-72 rounded-2xl bg-overlay" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
