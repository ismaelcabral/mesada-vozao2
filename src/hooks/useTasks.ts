import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: number;
  season_id: number;
  parent_user_id: string;
  child_user_id: string;
  title: string;
  description: string | null;
  value: number | null;
  deadline: string | null;
  status: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Demo user IDs for simplified mode
const DEMO_PARENT_ID = 'demo-parent-001';
const DEMO_CHILD_ID = 'demo-user-001';

export function useTasks(seasonId: number) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!seasonId || seasonId === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data as Task[]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (
    title: string,
    description: string,
    deadline: string,
    value: number,
    childUserId?: string
  ) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        season_id: seasonId,
        parent_user_id: DEMO_PARENT_ID,
        child_user_id: childUserId || DEMO_CHILD_ID,
        title,
        description,
        deadline,
        value,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    
    setTasks(prev => [data as Task, ...prev]);
    return data;
  }, [seasonId]);

  const updateTaskStatus = useCallback(async (taskId: number, status: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', taskId);

    if (error) throw error;
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status, completed_at: status === 'completed' ? new Date().toISOString() : null } : t
    ));
  }, []);

  return { tasks, loading, addTask, updateTaskStatus, refreshTasks: fetchTasks };
}
