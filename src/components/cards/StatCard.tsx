import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'yellow' | 'red' | 'goal' | 'accent';
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  className,
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    yellow: 'bg-yellow-card/10 border-yellow-card/30',
    red: 'bg-red-card/10 border-red-card/30',
    goal: 'bg-goal/10 border-goal/30',
    accent: 'bg-accent/10 border-accent/30 trophy-glow',
  };

  const valueStyles = {
    default: 'text-foreground',
    yellow: 'text-yellow-card',
    red: 'text-red-card',
    goal: 'text-goal',
    accent: 'text-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "stat-card flex flex-col gap-2 border",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className={cn("text-4xl font-display", valueStyles[variant])}>
        {value}
      </div>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </motion.div>
  );
}
