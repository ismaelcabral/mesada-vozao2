import { useMemo } from 'react';
import { useSeason } from './useSeason';
import { useCards } from './useCards';
import { useGoals } from './useGoals';
import {
  Classification,
  MonthSummary,
  BASE_ALLOWANCE,
  MAX_GOALS_PER_MONTH,
} from '@/types/mesada';

export interface MesadaStats {
  baseValue: number;
  yellowCards: number;
  redCards: number;
  goals: number;
  doubleGoals: number;
  totalPenalty: number;
  totalBonus: number;
  finalValue: number;
  classification: Classification;
  isRescueWeek: boolean;
}

export function calculateClassification(yellowCards: number, redCards: number): Classification {
  // Champion: 0 red cards and max 4 yellow cards
  if (redCards === 0 && yellowCards <= 4) {
    return 'champion';
  }
  // Série A: max 1 red card and max 6 yellow cards
  if (redCards <= 1 && yellowCards <= 6) {
    return 'serie-a';
  }
  // Série B: max 2 red cards and 7-9 yellow cards
  if (redCards <= 2 && yellowCards <= 9) {
    return 'serie-b';
  }
  // Relegation: more than 2 red cards or more than 10 yellow cards
  return 'relegation';
}

export function useMesada(seasonId?: number) {
  const { season, loading: seasonLoading, refreshSeason } = useSeason();
  const effectiveSeasonId = seasonId || season?.id || 0;
  
  const { yellowCards, redCards, loading: cardsLoading } = useCards(effectiveSeasonId);
  const { goals, loading: goalsLoading } = useGoals(effectiveSeasonId);

  const stats = useMemo<MesadaStats>(() => {
    const baseValue = parseFloat(season?.initial_value?.toString() || BASE_ALLOWANCE.toString());
    
    const yellowCount = yellowCards.length;
    const redCount = redCards.length;
    
    // Count goals and double goals
    const regularGoals = goals.filter(g => !g.is_double);
    const doubleGoalsList = goals.filter(g => g.is_double);
    
    // Calculate totals
    const totalPenalty = (yellowCount * 5) + (redCount * 15);
    const totalBonus = goals.reduce((sum, g) => sum + g.value, 0);
    
    // Final value calculation (minimum is 80)
    const finalValue = Math.max(80, baseValue + totalBonus - totalPenalty);
    
    // Calculate classification
    const classification = calculateClassification(yellowCount, redCount);
    
    // Check if it's rescue week (last week of the month)
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const isRescueWeek = now.getDate() > lastDayOfMonth - 7;

    return {
      baseValue,
      yellowCards: yellowCount,
      redCards: redCount,
      goals: regularGoals.length,
      doubleGoals: doubleGoalsList.length,
      totalPenalty,
      totalBonus,
      finalValue,
      classification,
      isRescueWeek,
    };
  }, [season, yellowCards, redCards, goals]);

  const summary = useMemo<MonthSummary>(() => {
    const now = new Date();
    const monthNames = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    return {
      month: monthNames[now.getMonth()],
      year: now.getFullYear(),
      baseValue: stats.baseValue,
      yellowCards: stats.yellowCards,
      redCards: stats.redCards,
      goals: stats.goals,
      doubleGoals: stats.doubleGoals,
      totalBonus: stats.totalBonus,
      totalPenalty: stats.totalPenalty,
      finalValue: stats.finalValue,
      classification: stats.classification,
    };
  }, [stats]);

  // Provide breakdown string for display
  const breakdown = `R$ ${stats.baseValue.toFixed(2)} + R$ ${stats.totalBonus.toFixed(2)} - R$ ${stats.totalPenalty.toFixed(2)} = R$ ${stats.finalValue.toFixed(2)}`;

  return {
    season,
    stats,
    summary,
    breakdown,
    loading: seasonLoading || cardsLoading || goalsLoading,
    refreshSeason,
  };
}
