"use client";

import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";

export function useSonner() {
  const toast = useCallback((message: string, description?: string) => {
    sonnerToast(message, {
      description,
      style: {
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      },
    });
  }, []);

  const success = useCallback((message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      style: {
        background: "var(--color-card)",
        border: "1px solid var(--color-success)",
        color: "var(--color-text)",
      },
    });
  }, []);

  const error = useCallback((message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      style: {
        background: "var(--color-card)",
        border: "1px solid var(--color-error)",
        color: "var(--color-text)",
      },
    });
  }, []);

  return { toast, success, error };
}
