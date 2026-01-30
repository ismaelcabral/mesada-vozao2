import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YellowCard {
  id: number;
  user_id: string;
  season_id: number;
  reason: string;
  value: number | null;
  recorded_at: string | null;
  created_at: string | null;
}

export interface RedCard {
  id: number;
  user_id: string;
  season_id: number;
  reason: string;
  value: number | null;
  recorded_at: string | null;
  created_at: string | null;
}

export function useCards(seasonId: number) {
  const [yellowCards, setYellowCards] = useState<YellowCard[]>([]);
  const [redCards, setRedCards] = useState<RedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    if (!seasonId || seasonId === 0) {
      setLoading(false);
      return;
    }

    try {
      const [yellowResult, redResult] = await Promise.all([
        supabase
          .from('yellow_cards')
          .select('*')
          .eq('season_id', seasonId)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('red_cards')
          .select('*')
          .eq('season_id', seasonId)
          .order('recorded_at', { ascending: false }),
      ]);

      if (!yellowResult.error) {
        setYellowCards(yellowResult.data as YellowCard[]);
      }
      if (!redResult.error) {
        setRedCards(redResult.data as RedCard[]);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addYellowCard = useCallback(async (reason: string, childUserId: string) => {
    if (yellowCards.length >= 6) {
      throw new Error('Limite de 6 cartões amarelos atingido');
    }

    if (!childUserId) throw new Error('Usuário não identificado');

    const { data, error } = await supabase
      .from('yellow_cards')
      .insert({
        season_id: seasonId,
        user_id: childUserId,
        reason,
        value: -5.00,
      })
      .select()
      .single();

    if (error) throw error;
    
    setYellowCards(prev => [data as YellowCard, ...prev]);
    return data;
  }, [seasonId, yellowCards.length]);

  const addRedCard = useCallback(async (reason: string, childUserId: string) => {
    if (redCards.length >= 2) {
      throw new Error('Limite de 2 cartões vermelhos atingido');
    }

    if (!childUserId) throw new Error('Usuário não identificado');

    const { data, error } = await supabase
      .from('red_cards')
      .insert({
        season_id: seasonId,
        user_id: childUserId,
        reason,
        value: -15.00,
      })
      .select()
      .single();

    if (error) throw error;
    
    setRedCards(prev => [data as RedCard, ...prev]);
    return data;
  }, [seasonId, redCards.length]);

  return { yellowCards, redCards, loading, addYellowCard, addRedCard, refreshCards: fetchCards };
}
