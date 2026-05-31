export default function ScanLoading() {
  return (
    <div className="animate-pulse mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-36 rounded-lg bg-overlay mb-6" />
      <div className="h-64 rounded-2xl bg-overlay max-w-lg mx-auto" />
    </div>
  );
}
