import React from "react";
import {
  CalendarDays,
  CalendarCheck2,
  Clock,
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
      icon: CalendarDays,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
      borderColor: "border-slate-200",
      accent: "text-slate-900",
    },
    {
      title: "Today's Sessions",
      value: todayCount,
      subtitle: "Scheduled for today",
      icon: CalendarCheck2,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50",
      borderColor: "border-sky-100",
      accent: "text-sky-950",
    },
    {
      title: "Pending Confirmation",
      value: pendingCount,
      subtitle: "Requires front-desk action",
      icon: AlertCircle,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      borderColor: "border-amber-100",
      accent: "text-amber-950",
    },
    {
      title: "Confirmed Sessions",
      value: confirmedCount,
      subtitle: "Ready for workout",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      borderColor: "border-emerald-100",
      accent: "text-emerald-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "bg-white rounded-xl p-5 border shadow-xs transition-all hover:shadow-sm",
              card.borderColor
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={cn("p-2 rounded-lg", card.iconBg, card.iconColor)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={cn("text-3xl font-extrabold tracking-tight", card.accent)}>
                {card.value}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
