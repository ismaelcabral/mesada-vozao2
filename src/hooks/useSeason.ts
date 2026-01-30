import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Season {
  id: number;
  user_id: string;
  month: number;
  year: number;
  initial_value: number | null;
  final_value: number | null;
  total_yellow_cards: number | null;
  total_red_cards: number | null;
  total_goals: number | null;
  total_bonus_value: number | null;
  total_penalty_value: number | null;
  classification: string | null;
  is_finalized: boolean | null;
  is_rescue_week: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// Demo user ID for simplified mode
const DEMO_USER_ID = 'demo-user-001';

export function useSeason() {
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateSeason = useCallback(async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      // Try to fetch existing season
      const { data, error: fetchError } = await supabase
        .from('seasons')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .eq('month', month)
        .eq('year', year)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Season doesn't exist, create one
        const { data: newSeason, error: createError } = await supabase
          .from('seasons')
          .insert({
            user_id: DEMO_USER_ID,
            month,
            year,
            initial_value: 150.00,
            classification: 'champion',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating season:', createError);
          setError(createError.message);
        } else {
          setSeason(newSeason as Season);
        }
      } else if (fetchError) {
        console.error('Error fetching season:', fetchError);
        setError(fetchError.message);
      } else {
        setSeason(data as Season);
      }
    } catch (err) {
      console.error('Error in useSeason:', err);
      setError('Erro ao carregar temporada');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateSeason();
  }, [fetchOrCreateSeason]);

  const refreshSeason = useCallback(async () => {
    if (!season?.id) return;
    
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', season.id)
      .single();

    if (!error && data) {
      setSeason(data as Season);
    }
  }, [season?.id]);

  return { season, loading, error, refreshSeason };
}
