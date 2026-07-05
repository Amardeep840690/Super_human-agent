import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: Readonly<SkeletonProps>) {
  return <div className={`skeleton rounded-2xl ${className}`} aria-hidden="true" />;
}

export function SkeletonCard({
  children,
  className = "",
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`fade-in rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.14)] ${className}`}
    >
      {children}
    </div>
  );
}
