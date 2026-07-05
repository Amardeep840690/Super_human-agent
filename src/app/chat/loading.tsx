import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <SkeletonCard className="min-h-[70vh] p-5 sm:p-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-6 w-64 rounded-2xl" />
          <Skeleton className="mt-4 h-px w-full rounded-none" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-24 w-[72%] rounded-[1.5rem]" />
            <Skeleton className="ml-auto h-20 w-[58%] rounded-[1.5rem]" />
            <Skeleton className="h-20 w-[64%] rounded-[1.5rem]" />
          </div>
          <Skeleton className="mt-6 h-14 w-full rounded-full" />
        </SkeletonCard>

        <div className="space-y-4">
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </SkeletonCard>
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-28" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </main>
  );
}
