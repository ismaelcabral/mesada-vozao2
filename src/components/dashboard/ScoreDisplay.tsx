import { motion } from "framer-motion";
import { Trophy } from "@/components/icons/Trophy";

interface ScoreDisplayProps {
  baseValue: number;
  bonus: number;
  penalty: number;
  finalValue: number;
}

export function ScoreDisplay({ baseValue, bonus, penalty, finalValue }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-3xl p-6 border border-border relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={28} />
          <h2 className="font-display text-xl tracking-wide text-accent">
            MESADA DO MÊS
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Base</span>
            <span className="font-semibold">R$ {baseValue.toFixed(2)}</span>
          </div>
          
          {bonus > 0 && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex justify-between items-center text-goal"
            >
              <span className="flex items-center gap-2">
                <span>⚽</span> Gols
              </span>
              <span className="font-semibold">+ R$ {bonus.toFixed(2)}</span>
            </motion.div>
          )}
          
          {penalty > 0 && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex justify-between items-center text-red-card"
            >
              <span className="flex items-center gap-2">
                <span>🟨</span> Cartões
              </span>
              <span className="font-semibold">- R$ {penalty.toFixed(2)}</span>
            </motion.div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-muted-foreground">TOTAL</span>
            <motion.span
              key={finalValue}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-display text-4xl text-accent"
            >
              R$ {finalValue.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
