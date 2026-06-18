export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full animate-pulse rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="h-4 w-36 rounded-full bg-white/10" />
        <div className="mt-6 h-10 w-1/2 rounded-2xl bg-white/10" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="h-40 rounded-3xl bg-white/10" />
          <div className="h-40 rounded-3xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
