import React from "react";
import { Service } from "@/types/booking";
import { cn } from "@/lib/utils";

interface ServiceBadgeProps {
  service: Service;
  className?: string;
}

export function ServiceBadge({ service, className }: ServiceBadgeProps) {
  const configs: Record<Service, { label: string; style: string }> = {
    "Personal Training": {
      label: "Personal Training",
      style: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    },
    Yoga: {
      label: "Yoga",
      style: "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    },
    HIIT: {
      label: "HIIT",
      style: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    Pilates: {
      label: "Pilates",
      style: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    },
  };

  const config = configs[service] || {
    label: service,
    style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
        config.style,
        className
      )}
    >
      {config.label}
    </span>
  );
}
