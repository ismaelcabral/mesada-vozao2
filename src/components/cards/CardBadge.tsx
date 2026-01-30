import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CardType } from "@/types/mesada";

interface CardBadgeProps {
  type: CardType;
  count: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CardBadge({ type, count, showAnimation = false, size = 'md' }: CardBadgeProps) {
  const isYellow = type === 'yellow';
  
  const sizeClasses = {
    sm: 'w-8 h-12 text-xs',
    md: 'w-12 h-16 text-sm',
    lg: 'w-16 h-24 text-base',
  };

  return (
    <motion.div
      initial={showAnimation ? { rotateY: 90, scale: 0.8 } : false}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative rounded-md flex items-center justify-center font-bold",
        sizeClasses[size],
        isYellow ? "card-yellow" : "card-red"
      )}
    >
      <span className={cn(
        "font-display text-2xl",
        isYellow ? "text-black" : "text-white"
      )}>
        {count}
      </span>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center text-[10px] font-bold border border-border">
        {isYellow ? '🟡' : '🔴'}
      </div>
    </motion.div>
  );
}
