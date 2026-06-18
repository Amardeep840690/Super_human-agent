export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full animate-pulse rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="mt-6 h-12 w-1/2 rounded-2xl bg-white/10" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-white/10" />
        <div className="mt-8 h-12 w-48 rounded-full bg-white/10" />
      </div>
    </main>
  );
}
