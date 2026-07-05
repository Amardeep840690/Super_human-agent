import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="space-y-4">
        <SkeletonCard className="p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-3/5 rounded-2xl" />
              <Skeleton className="h-4 w-full max-w-2xl rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-36 rounded-full" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </SkeletonCard>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-6 w-40 rounded-2xl" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </SkeletonCard>
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-20 rounded-2xl" />
            <Skeleton className="mt-3 h-10 w-28 rounded-full" />
          </SkeletonCard>
        </div>
      </div>
    </main>
  );
}
