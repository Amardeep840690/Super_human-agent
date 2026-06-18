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
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-50";
    case "error":
      return "border-rose-400/20 bg-rose-400/10 text-rose-50";
    default:
      return "border-sky-400/20 bg-sky-400/10 text-sky-50";
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
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.9)] backdrop-blur-xl ${getVariantStyles(toast.variant)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="text-sm/5 text-white/75">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
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
