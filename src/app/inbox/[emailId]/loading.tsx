import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function InboxEmailLoading() {
  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto w-full max-w-[900px]">
        <Skeleton className="h-9 w-44 rounded-full" />

        <SkeletonCard className="mt-4 rounded-[1.75rem] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-4/5 rounded-2xl" />
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>
          <div className="mt-6 grid gap-3 border-y border-[color:var(--border)] py-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`meta-${index}`} className="space-y-2">
                <Skeleton className="h-3.5 w-20 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-4 w-36 rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="mt-6 rounded-[1.75rem] px-5 py-5 sm:px-6">
          <div className="mx-auto w-full max-w-[860px] space-y-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] px-5 py-6 sm:px-7 sm:py-8">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-[92%] rounded-full" />
            <Skeleton className="h-4 w-[88%] rounded-full" />
            <Skeleton className="h-4 w-[81%] rounded-full" />
            <Skeleton className="h-4 w-[75%] rounded-full" />
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
