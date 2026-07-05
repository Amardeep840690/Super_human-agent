"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getVariantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-[color:var(--border)] border-l-4 border-l-emerald-500 bg-[var(--card)] text-[var(--foreground)]";
    case "error":
      return "border-[color:var(--border)] border-l-4 border-l-rose-500 bg-[var(--card)] text-[var(--foreground)]";
    default:
      return "border-[color:var(--border)] border-l-4 border-l-[var(--accent)] bg-[var(--card)] text-[var(--foreground)]";
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...toast }]);
    window.setTimeout(() => removeToast(id), 4200);
  };

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl px-4 py-3 shadow-[0_20px_60px_-24px_rgba(var(--shadow),0.18)] backdrop-blur-xl transition duration-200 ${getVariantStyles(toast.variant)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="text-sm/5 text-[var(--muted)]">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full px-2 py-1 text-xs text-[var(--muted)] transition hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
