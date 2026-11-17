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
      style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    Yoga: {
      label: "Yoga",
      style: "bg-teal-50 text-teal-700 border-teal-200",
    },
    HIIT: {
      label: "HIIT",
      style: "bg-amber-50 text-amber-700 border-amber-200",
    },
    Pilates: {
      label: "Pilates",
      style: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const config = configs[service] || {
    label: service,
    style: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.style,
        className
      )}
    >
      {config.label}
    </span>
  );
}
