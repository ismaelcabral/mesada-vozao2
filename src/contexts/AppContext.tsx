import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface Transaction {
  id: number;
  type: 'goal' | 'yellow_card' | 'red_card';
  description: string;
  amount: number;
  date: string;
  season_id?: number;
}

export interface Task { id: string; title: string; description: string; deadline: string; completed: boolean; status?: string; createdAt: string; }
export interface Message { id: string; type: string; content: string; read: boolean; createdAt: string; }

interface AppContextType {
  transactions: Transaction[];
  tasks: Task[];
  messages: Message[];
  currentMesadaBase: number;
  currentSeasonId: number | null;

  addTransaction: (type: 'goal' | 'yellow_card' | 'red_card', description: string, amount: number) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;

  addGoal: (d: string, isDouble: boolean) => Promise<void>;
  addCard: (r: string, t: 'yellow' | 'red') => Promise<void>;

  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  completeTask: (id: string, c: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  sendMessage: (content: string) => Promise<void>;
  markMessageAsRead: (id: string) => void;

  updateMesadaBase: (newVal: number) => Promise<void>;
  closeMonth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // --- INIT USER ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setCurrentUser(session.user.id);
    });
  }, []);

  // --- QUERY: SEASON ---
  const { data: currentSeason } = useQuery({
    queryKey: ['season', currentUser],
    enabled: !!currentUser,
    queryFn: async () => {
      if (!currentUser) return null;
      const now = new Date();
      // Logic: find active season for this User (Parent or Child logic needed? Using simple user_id match for MVP)
      // Assuming parent is logged in or user owns their season.
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear())
        .eq('user_id', currentUser)
        .maybeSingle();

      if (!data) {
        // Create if missing
        const { data: newSeason, error: createError } = await supabase
          .from('seasons')
          .insert({
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            user_id: currentUser,
            initial_value: 150
          })
          .select()
          .single();
        if (createError) throw createError;
        return newSeason;
      }
      return data;
    }
  });

  const currentMesadaBase = currentSeason?.initial_value ?? 150;
  const currentSeasonId = currentSeason?.id ?? null;

  // --- QUERY: TRANSACTIONS ---
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', currentSeasonId],
    enabled: !!currentSeasonId,
    queryFn: async () => {
      // Filter by Season ID to ensure we only see current month? 
      // User requested "Extrato" which implies current relevant history. 
      // Querying ALL transactions might be heavy but simplified for MVP. 
      // Let's filter by season_id if we have it, or raw list.
      // Ideally should filter by season_id.
      if (!currentSeasonId) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('season_id', currentSeasonId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((t: any) => ({
        id: t.id,
        type: t.type,
        description: t.description || '',
        amount: Number(t.amount),
        date: t.created_at,
        season_id: t.season_id
      })) as Transaction[];
    }
  });

  // --- QUERY: TASKS ---
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', currentSeasonId],
    enabled: !!currentSeasonId,
    queryFn: async () => {
      if (!currentSeasonId) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('season_id', currentSeasonId);
      if (error) throw error;
      return data.map((t: any) => ({
        id: `task-${t.id}`,
        title: t.title, description: t.description || '', deadline: t.deadline || new Date().toISOString(),
        completed: t.status === 'completed',
        status: t.status,
        createdAt: t.created_at
      })) as Task[];
    }
  });

  // --- QUERY: MESSAGES ---
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', currentSeasonId],
    enabled: !!currentSeasonId,
    queryFn: async () => {
      if (!currentSeasonId) return [];
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .eq('season_id', currentSeasonId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((m: any) => ({
        id: `msg-${m.id}`,
        type: m.message_type || 'info',
        content: m.message,
        read: m.is_read,
        createdAt: m.created_at
      })) as Message[];
    }
  });

  // --- REALTIME ---
  useEffect(() => {
    const channel = supabase.channel('app_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['season'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // --- ACTIONS ---

  const addTransaction = async (type: 'goal' | 'yellow_card' | 'red_card', description: string, amount: number) => {
    try {
      if (!currentSeasonId || !currentUser) throw new Error("Temporada/Usuário não carregado");
      await supabase.from('transactions').insert({
        type,
        description,
        amount,
        season_id: currentSeasonId,
        user_id: currentUser
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success("Registrado!");
    } catch (e: any) { toast.error("Erro: " + e.message); }
  };

  const deleteTransaction = async (id: number) => {
    await supabase.from('transactions').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  const addGoal = async (d: string, isDouble: boolean) => {
    await addTransaction('goal', d, isDouble ? 10 : 5);
  };
  const addCard = async (r: string, t: 'yellow' | 'red') => {
    const amount = t === 'yellow' ? 5 : 15;
    await addTransaction(t === 'yellow' ? 'yellow_card' : 'red_card', r, -(amount));
  };

  const addTask = async (t: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      if (!currentSeasonId || !currentUser) throw new Error("Temporada não carregada");
      await supabase.from('tasks').insert({
        title: t.title, description: t.description, deadline: t.deadline,
        status: 'pending',
        season_id: currentSeasonId,
        parent_user_id: currentUser,
        child_user_id: currentUser // Simplify ownership
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tarefa criada!");
    } catch (e: any) { toast.error("Erro: " + e.message); }
  };
  const completeTask = async (id: string, c: boolean) => {
    await supabase.from('tasks').update({ status: c ? 'completed' : 'pending' }).eq('id', id.replace('task-', ''));
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };
  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id.replace('task-', ''));
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  // --- NEW FEATURES ---

  const sendMessage = async (content: string) => {
    if (!currentSeasonId || !currentUser) return;
    try {
      await supabase.from('motivational_messages').insert({
        message: content,
        season_id: currentSeasonId,
        parent_user_id: currentUser,
        child_user_id: currentUser, // Simplifying: user is both parent/child context for now
        is_read: false
      });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success("Mensagem enviada!");
    } catch (e: any) { toast.error("Erro ao enviar mensagem"); }
  };

  const markMessageAsRead = async (id: string) => {
    await supabase.from('motivational_messages').update({ is_read: true }).eq('id', id.replace('msg-', ''));
    queryClient.invalidateQueries({ queryKey: ['messages'] });
  };

  const updateMesadaBase = async (newVal: number) => {
    if (!currentSeasonId) return;
    try {
      await supabase.from('seasons').update({ initial_value: newVal }).eq('id', currentSeasonId);
      queryClient.invalidateQueries({ queryKey: ['season'] });
      toast.success("Valor base atualizado!");
    } catch (e) { toast.error("Erro ao atualizar valor"); }
  };

  const closeMonth = async () => {
    if (!currentSeasonId) return;
    try {
      await supabase.from('seasons').update({ is_finalized: true }).eq('id', currentSeasonId);
      queryClient.invalidateQueries({ queryKey: ['season'] });
      toast.success("Mês fechado com sucesso!");
    } catch (e) { toast.error("Erro ao fechar mês"); }
  };

  const value: AppContextType = {
    transactions, tasks, messages,
    currentMesadaBase, currentSeasonId,
    addTransaction, deleteTransaction,
    addGoal, addCard,
    addTask, completeTask, deleteTask,
    sendMessage, markMessageAsRead,
    updateMesadaBase, closeMonth
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp missing');
  return context;
}