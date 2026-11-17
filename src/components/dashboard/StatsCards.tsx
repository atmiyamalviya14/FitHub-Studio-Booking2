import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarCheck2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  total: number;
  todayCount: number;
  pendingCount: number;
  confirmedCount: number;
}

export function StatsCards({
  total,
  todayCount,
  pendingCount,
  confirmedCount,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Bookings",
      value: total,
      subtitle: "All studio services",
      href: "/bookings",
      icon: CalendarDays,
      iconColor: "text-slate-700 dark:text-slate-300",
      iconBg: "bg-slate-100 dark:bg-slate-800",
      borderColor: "border-slate-200 dark:border-slate-800",
      accent: "text-slate-900 dark:text-white",
    },
    {
      title: "Today's Sessions",
      value: todayCount,
      subtitle: "View in week calendar",
      href: "/bookings?view=calendar",
      icon: CalendarCheck2,
      iconColor: "text-sky-600 dark:text-sky-400",
      iconBg: "bg-sky-50 dark:bg-sky-950/40",
      borderColor: "border-sky-100 dark:border-sky-900/50",
      accent: "text-sky-950 dark:text-sky-300",
    },
    {
      title: "Pending Confirmation",
      value: pendingCount,
      subtitle: "Requires front-desk action",
      href: "/bookings?status=pending",
      icon: AlertCircle,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "border-amber-100 dark:border-amber-900/50",
      accent: "text-amber-950 dark:text-amber-300",
    },
    {
      title: "Confirmed Sessions",
      value: confirmedCount,
      subtitle: "Ready for workout",
      href: "/bookings?status=confirmed",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-100 dark:border-emerald-900/50",
      accent: "text-emerald-950 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            href={card.href}
            className={cn(
              "block bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-xs transition-all hover:shadow-md hover:border-emerald-400/60 dark:hover:border-emerald-600/60 group",
              card.borderColor
            )}
            title={`View ${card.title} in Bookings`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {card.title}
              </span>
              <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-105", card.iconBg, card.iconColor)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={cn("text-3xl font-extrabold tracking-tight", card.accent)}>
                {card.value}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.subtitle}</p>
          </Link>
        );
      })}
    </div>
  );
}
