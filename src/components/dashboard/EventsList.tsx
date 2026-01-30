import { motion } from "framer-motion";
import { CardEvent, GoalEvent } from "@/types/mesada";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EventsListProps {
  cards: CardEvent[];
  goals: GoalEvent[];
}

type CombinedEvent = (CardEvent | GoalEvent) & { eventType: 'card' | 'goal' };

export function EventsList({ cards, goals }: EventsListProps) {
  // Combine and sort events by date
  const allEvents: CombinedEvent[] = [
    ...cards.map(c => ({ ...c, eventType: 'card' as const })),
    ...goals.map(g => ({ ...g, eventType: 'goal' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentEvents = allEvents.slice(0, 6);

  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <h3 className="font-display text-lg tracking-wide text-foreground mb-4 flex items-center gap-2">
        📋 ÚLTIMOS EVENTOS
      </h3>

      <div className="space-y-3">
        {recentEvents.map((event, index) => {
          const isCard = event.eventType === 'card';
          const cardEvent = isCard ? (event as CardEvent) : null;
          const goalEvent = !isCard ? (event as GoalEvent) : null;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                isCard && cardEvent?.type === 'yellow' && "bg-yellow-card/10",
                isCard && cardEvent?.type === 'red' && "bg-red-card/10",
                !isCard && "bg-goal/10"
              )}
            >
              <div className="text-2xl">
                {isCard ? (cardEvent?.type === 'yellow' ? '🟨' : '🟥') : '⚽'}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {event.reason}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.date), "d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>

              <div className={cn(
                "text-sm font-bold",
                isCard ? "text-red-card" : "text-goal"
              )}>
                {isCard ? `-R$ ${event.value}` : `+R$ ${event.value}`}
              </div>
            </motion.div>
          );
        })}

        {recentEvents.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Nenhum evento registrado ainda
          </p>
        )}
      </div>
    </div>
  );
}
