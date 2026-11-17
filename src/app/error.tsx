"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-center space-y-5">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {error.message ||
              "An unexpected error occurred while loading this view. Please try reloading or return to the dashboard."}
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-slate-400">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
