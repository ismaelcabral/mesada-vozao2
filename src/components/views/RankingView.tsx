import { motion } from "framer-motion";
import { ClassificationBadge } from "@/components/cards/ClassificationBadge";
import { Classification, CLASSIFICATION_CONFIG } from "@/types/mesada";

interface RankingViewProps {
  currentClassification: Classification;
  yellowCards: number;
  redCards: number;
}

export function RankingView({ currentClassification, yellowCards, redCards }: RankingViewProps) {
  const allClassifications: Classification[] = ['champion', 'serie-a', 'serie-b', 'relegation'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="font-display text-2xl tracking-wide mb-2">SUA CLASSIFICAÇÃO</h2>
        <p className="text-muted-foreground text-sm">
          {yellowCards} amarelos • {redCards} vermelhos
        </p>
      </motion.div>

      <ClassificationBadge classification={currentClassification} />

      <div className="mt-8">
        <h3 className="font-display text-lg tracking-wide mb-4 text-muted-foreground">
          TABELA DE CLASSIFICAÇÃO
        </h3>
        
        <div className="space-y-3">
          {allClassifications.map((classification, index) => {
            const config = CLASSIFICATION_CONFIG[classification];
            const isCurrent = classification === currentClassification;

            return (
              <motion.div
                key={classification}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                  ${isCurrent 
                    ? classification === 'champion' 
                      ? 'border-champion bg-champion/10' 
                      : classification === 'serie-a'
                        ? 'border-serie-a bg-serie-a/10'
                        : classification === 'serie-b'
                          ? 'border-serie-b bg-serie-b/10'
                          : 'border-relegation bg-relegation/10'
                    : 'border-border bg-card'
                  }
                `}
              >
                <div className="text-3xl">{config.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{config.name}</div>
                  <div className="text-xs text-muted-foreground">{config.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-muted-foreground">
                    R$ {config.minValue} - R$ {config.maxValue}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
