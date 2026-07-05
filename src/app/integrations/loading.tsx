import { Skeleton, SkeletonCard } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="space-y-4">
        <SkeletonCard className="p-5 sm:p-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-6 w-72 rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl rounded-xl" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </SkeletonCard>

        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard className="p-5">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-3 h-12 rounded-2xl" />
          </SkeletonCard>
          <SkeletonCard className="p-5">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-3 h-12 rounded-2xl" />
          </SkeletonCard>
        </div>
      </div>
    </main>
  );
}
