import { motion } from "framer-motion";
import { CardEvent, GoalEvent } from "@/types/mesada";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface HistoryViewProps {
  cards: CardEvent[];
  goals: GoalEvent[];
}

export function HistoryView({ cards, goals }: HistoryViewProps) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  const thisWeekCards = cards.filter(c => 
    isWithinInterval(new Date(c.date), { start: weekStart, end: weekEnd })
  );
  
  const thisWeekGoals = goals.filter(g => 
    isWithinInterval(new Date(g.date), { start: weekStart, end: weekEnd })
  );

  const weeklyPenalty = thisWeekCards.reduce((sum, c) => sum + c.value, 0);
  const weeklyBonus = thisWeekGoals.reduce((sum, g) => sum + g.value, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl tracking-wide mb-2">ESTA SEMANA</h2>
        <p className="text-muted-foreground text-sm">
          {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMMM", { locale: ptBR })}
        </p>
      </motion.div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stat-card text-center"
        >
          <div className="text-3xl mb-2">🟨</div>
          <div className="font-display text-2xl text-yellow-card">{thisWeekCards.filter(c => c.type === 'yellow').length}</div>
          <div className="text-xs text-muted-foreground">Amarelos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card text-center"
        >
          <div className="text-3xl mb-2">⚽</div>
          <div className="font-display text-2xl text-goal">{thisWeekGoals.length}</div>
          <div className="text-xs text-muted-foreground">Gols</div>
        </motion.div>
      </div>

      {/* Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 border border-border"
      >
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">SALDO DA SEMANA</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-goal">+R$ {weeklyBonus}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-card">-R$ {weeklyPenalty}</span>
          </div>
          <div className={cn(
            "font-display text-xl",
            weeklyBonus - weeklyPenalty >= 0 ? "text-goal" : "text-red-card"
          )}>
            {weeklyBonus - weeklyPenalty >= 0 ? '+' : ''}R$ {weeklyBonus - weeklyPenalty}
          </div>
        </div>
      </motion.div>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-display text-lg tracking-wide text-muted-foreground">
          EVENTOS DA SEMANA
        </h3>

        {[...thisWeekCards, ...thisWeekGoals]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((event, index) => {
            const isCard = 'type' in event && (event.type === 'yellow' || event.type === 'red');
            const cardType = isCard ? (event as CardEvent).type : null;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  isCard && cardType === 'yellow' && "bg-yellow-card/10",
                  isCard && cardType === 'red' && "bg-red-card/10",
                  !isCard && "bg-goal/10"
                )}
              >
                <div className="text-2xl">
                  {isCard ? (cardType === 'yellow' ? '🟨' : '🟥') : '⚽'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "EEEE, d", { locale: ptBR })}
                  </p>
                </div>
                <div className={cn(
                  "font-bold text-sm",
                  isCard ? "text-red-card" : "text-goal"
                )}>
                  {isCard ? '-' : '+'}R$ {event.value}
                </div>
              </motion.div>
            );
          })}

        {thisWeekCards.length === 0 && thisWeekGoals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📭</div>
            <p>Nenhum evento esta semana</p>
          </div>
        )}
      </div>
    </div>
  );
}
