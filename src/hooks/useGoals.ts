import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Goal {
  id: number;
  user_id: string;
  season_id: number;
  description: string;
  value: number;
  is_double: boolean | null;
  recorded_at: string | null;
  created_at: string | null;
}

export function useGoals(seasonId: number) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!seasonId || seasonId === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('season_id', seasonId)
        .order('recorded_at', { ascending: false });

      if (!error && data) {
        setGoals(data as Goal[]);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (description: string, isDouble: boolean = false, childUserId: string) => {
    if (goals.length >= 10) {
      throw new Error('Limite de 10 gols atingido');
    }

    if (!childUserId) throw new Error('Usuário não identificado');

    const value = isDouble ? 10.00 : 5.00;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        season_id: seasonId,
        user_id: childUserId,
        description,
        value,
        is_double: isDouble,
      })
      .select()
      .single();

    if (error) throw error;
    
    setGoals(prev => [data as Goal, ...prev]);
    return data;
  }, [seasonId, goals.length]);

  return { goals, loading, addGoal, refreshGoals: fetchGoals };
}
