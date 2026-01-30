export type CardType = 'yellow' | 'red';
export type GoalType = 'goal' | 'double-goal';

export interface CardEvent {
  id: string;
  type: CardType;
  reason: string;
  date: Date;
  value: number;
}

export interface GoalEvent {
  id: string;
  type: GoalType;
  reason: string;
  date: Date;
  value: number;
}

export type Classification = 'champion' | 'serie-a' | 'serie-b' | 'relegation';

export interface MonthSummary {
  month: string;
  year: number;
  baseValue: number;
  yellowCards: number;
  redCards: number;
  goals: number;
  doubleGoals: number;
  totalBonus: number;
  totalPenalty: number;
  finalValue: number;
  classification: Classification;
}

export interface PlayerProfile {
  name: string;
  nickname: string;
  avatarUrl?: string;
}

export const CARD_VALUES = {
  yellow: 5,
  red: 15,
} as const;

export const GOAL_VALUES = {
  goal: 5,
  'double-goal': 10,
} as const;

export const BASE_ALLOWANCE = 150;
export const MAX_GOALS_PER_MONTH = 10;
export const MAX_YELLOW_CARDS = 6;
export const MAX_RED_CARDS = 2;

export const CLASSIFICATION_CONFIG: Record<Classification, {
  name: string;
  emoji: string;
  minValue: number;
  maxValue: number;
  description: string;
}> = {
  champion: {
    name: 'CAMPEÃO DO VOZÃO',
    emoji: '🏆',
    minValue: 150,
    maxValue: 200,
    description: 'Até 4 amarelos, 0 vermelho',
  },
  'serie-a': {
    name: 'SÉRIE A',
    emoji: '🥇',
    minValue: 130,
    maxValue: 150,
    description: 'Até 6 amarelos, máx. 1 vermelho',
  },
  'serie-b': {
    name: 'SÉRIE B',
    emoji: '🥈',
    minValue: 100,
    maxValue: 120,
    description: '7 a 9 amarelos, até 2 vermelhos',
  },
  relegation: {
    name: 'REBAIXAMENTO',
    emoji: '⚠️',
    minValue: 80,
    maxValue: 100,
    description: '+10 amarelos, +2 vermelhos',
  },
};
