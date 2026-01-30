import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SoccerBall } from "@/components/icons/SoccerBall";

interface GoalBadgeProps {
  count: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GoalBadge({ count, showAnimation = false, size = 'md' }: GoalBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -10 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
      className={cn(
        "relative rounded-full flex items-center justify-center bg-goal/20 border-2 border-goal goal-glow",
        sizeClasses[size]
      )}
    >
      <SoccerBall size={iconSizes[size]} className="text-goal" />
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-goal rounded-full flex items-center justify-center text-xs font-bold text-background">
        {count}
      </div>
    </motion.div>
  );
}
