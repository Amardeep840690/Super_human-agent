import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)]">
        <SkeletonCard className="min-h-[calc(100vh-10rem)] overflow-hidden p-0">
          <div className="border-b border-[color:var(--border)] p-5">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="mt-3 h-8 w-64 rounded-2xl" />
            <Skeleton className="mt-4 h-12 w-full rounded-full" />
            <div className="mt-4 flex gap-2 overflow-hidden">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={`loading-row-${index}`}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] p-4"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-2.5 w-2.5 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-4 w-28 rounded-xl" />
                      <Skeleton className="h-3.5 w-14 rounded-xl" />
                    </div>
                    <Skeleton className="h-4 w-3/5 rounded-xl" />
                    <Skeleton className="h-3.5 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="min-h-[calc(100vh-10rem)] overflow-hidden p-0">
          <div className="border-b border-[color:var(--border)] p-5">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="mt-3 h-10 w-4/5 rounded-2xl" />
          </div>
          <div className="space-y-5 p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-px w-full rounded-none" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-xl" />
              <Skeleton className="h-4 w-[92%] rounded-xl" />
              <Skeleton className="h-4 w-[88%] rounded-xl" />
              <Skeleton className="h-4 w-[80%] rounded-xl" />
              <Skeleton className="h-4 w-[84%] rounded-xl" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </main>
  );
}
