import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Classification, CLASSIFICATION_CONFIG } from "@/types/mesada";

interface ClassificationBadgeProps {
  classification: Classification;
  showAnimation?: boolean;
}

export function ClassificationBadge({ classification, showAnimation = true }: ClassificationBadgeProps) {
  const config = CLASSIFICATION_CONFIG[classification];

  const bgClasses: Record<Classification, string> = {
    champion: 'bg-champion/20 border-champion trophy-glow',
    'serie-a': 'bg-serie-a/20 border-serie-a',
    'serie-b': 'bg-serie-b/20 border-serie-b',
    relegation: 'bg-relegation/20 border-relegation',
  };

  const textClasses: Record<Classification, string> = {
    champion: 'text-champion',
    'serie-a': 'text-serie-a',
    'serie-b': 'text-serie-b',
    relegation: 'text-relegation',
  };

  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className={cn(
        "rounded-2xl border-2 p-6 text-center",
        bgClasses[classification]
      )}
    >
      <motion.div
        initial={showAnimation ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-5xl mb-3"
      >
        {config.emoji}
      </motion.div>
      <h3 className={cn("font-display text-2xl tracking-wider", textClasses[classification])}>
        {config.name}
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        {config.description}
      </p>
    </motion.div>
  );
}
