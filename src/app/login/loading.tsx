import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <SkeletonCard className="grid w-full gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 sm:p-10 lg:p-12">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-3/5 rounded-2xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-xl rounded-xl" />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] bg-[var(--surface-muted)] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-6 w-52 rounded-2xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-md rounded-xl" />
          <Skeleton className="mt-8 h-12 w-full rounded-full" />
          <Skeleton className="mt-3 h-12 w-full rounded-full" />
          <Skeleton className="mt-4 h-20 w-full rounded-2xl" />
        </div>
      </SkeletonCard>
    </main>
  );
}
