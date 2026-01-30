import { StatCard } from "@/components/cards/StatCard";

interface StatsGridProps {
  yellowCards: number;
  redCards: number;
  goals: number;
  doubleGoals: number;
}

export function StatsGrid({ yellowCards, redCards, goals, doubleGoals }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Amarelos"
        value={yellowCards}
        subtitle={`-R$ ${yellowCards * 5}`}
        icon="🟨"
        variant="yellow"
        delay={0.1}
      />
      
      <StatCard
        title="Vermelhos"
        value={redCards}
        subtitle={`-R$ ${redCards * 15}`}
        icon="🟥"
        variant="red"
        delay={0.2}
      />
      
      <StatCard
        title="Gols"
        value={goals}
        subtitle={`+R$ ${goals * 5}`}
        icon="⚽"
        variant="goal"
        delay={0.3}
      />
      
      <StatCard
        title="Gol Duplo"
        value={doubleGoals}
        subtitle={`+R$ ${doubleGoals * 10}`}
        icon="🏆"
        variant="accent"
        delay={0.4}
      />
    </div>
  );
}
