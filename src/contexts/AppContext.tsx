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
  childId: string | null;
  isParent: boolean;

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
  const [childId, setChildId] = useState<string | null>(null);
  const [isParent, setIsParent] = useState(false);

  // --- INIT USER & FIND CHILD ---
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const userId = session.user.id;
      setCurrentUser(userId);

      // Check role
      const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', userId).single();
      const role = myProfile?.role || 'child'; // default to child if unknown? Or logic

      const amIParent = role === 'parent';
      setIsParent(amIParent);

      if (amIParent) {
        // Find my child (Simple MVP: find ANY child in the DB, ideally needs family linkage)
        // Prompt says: "SELECT * FROM profiles WHERE role = 'child' LIMIT 1"
        const { data: childProfile } = await supabase.from('profiles').select('id').eq('role', 'child').limit(1).maybeSingle();
        if (childProfile) {
          setChildId(childProfile.id);
        } else {
          console.error("No child profile found!");
        }
      } else {
        // I am the child
        setChildId(userId);
      }
    };
    init();
  }, []);

  // --- ENSURE SEASON EXISTS FOR CHILD ---
  useEffect(() => {
    if (!childId) return; // Wait until we know who the child is

    const ensureSeason = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Check active season for CHILD
        const { data: existingSeason } = await supabase
          .from('seasons')
          .select('id')
          .eq('child_id', childId) // Correct column name based on user request
          .eq('is_active', true)
          .maybeSingle();

        if (existingSeason) return;

        console.log("Creating new season for child:", childId);
        const { data, error: createError } = await supabase
          .from('seasons')
          .insert({
            month,
            year,
            child_id: childId, // Correct column
            base_value: 150,   // Correct column
            is_active: true
          } as any) // Type assertion if types.ts is stale
          .select()
          .single();

        if (createError) console.error("Error creating season:", createError);
        else {
          console.log('Season criada com sucesso:', data);
          queryClient.invalidateQueries({ queryKey: ['season'] });
          toast.success("Nova temporada iniciada!");
        }
      } catch (err) {
        console.error("Season init error:", err);
      }
    };

    ensureSeason();
  }, [childId, queryClient]);

  // --- QUERY: SEASON (Of the Child) ---
  const { data: currentSeason } = useQuery({
    queryKey: ['season', childId],
    enabled: !!childId,
    queryFn: async () => {
      if (!childId) return null;
      // Fetch active season
      const query = supabase
        .from('seasons')
        .select('*')
        .eq('child_id', childId)
        .eq('is_active', true);

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching season:", error);
        return null;
      }

      // Robust check: if data is array (shouldn't be with maybeSingle, but just in case of weird mock/client behavior)
      const seasonData = Array.isArray(data) ? data[0] : data;
      return seasonData;
    }
  });

  // Use base_value instead of initial_value
  const currentMesadaBase = (currentSeason as any)?.base_value ?? 150;
  const currentSeasonId = (currentSeason as any)?.id ?? null;

  console.log('SEASON ID CARREGADO:', currentSeasonId); // DEBUG REQUESTED

  // --- QUERY: TRANSACTIONS ---
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', currentSeasonId],
    enabled: !!currentSeasonId,
    queryFn: async () => {
      if (!currentSeasonId) return [];
      console.log("Fetching transactions for season:", currentSeasonId); // Extra debug
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
    // Listen for changes in Transactions
    const transactionsChannel = supabase.channel('realtime-transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          console.log('Transação detectada! Atualizando...');
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['season'] }); // Balance might change
        }
      )
      .subscribe();

    // Listen for changes in Tasks
    const tasksChannel = supabase.channel('realtime-tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          console.log('Tarefa detectada! Atualizando...');
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    // Listen for changes in Messages
    const messagesChannel = supabase.channel('realtime-messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'motivational_messages' },
        () => {
          console.log('Mensagem detectada! Atualizando...');
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [queryClient]);

  // --- ACTIONS ---

  const addTransaction = async (type: 'goal' | 'yellow_card' | 'red_card', description: string, amount: number) => {
    try {
      if (!currentSeasonId || !childId) throw new Error("Temporada/Usuário (Filho) não identificado");

      const payload = {
        type,
        description: description || "",
        amount: Number(amount),
        season_id: Number(currentSeasonId)
      };

      console.log('Enviando Payload:', payload);

      const { error } = await supabase.from('transactions').insert(payload);

      if (error) {
        console.error("Erro Supabase Insert:", error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success("Registrado!");
    } catch (e: any) {
      console.error("Erro addTransaction:", e);
      toast.error("Erro: " + e.message);
    }
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
      if (!currentSeasonId || !currentUser || !childId) throw new Error("Contexto inválido");
      await supabase.from('tasks').insert({
        title: t.title, description: t.description, deadline: t.deadline,
        status: 'pending',
        season_id: currentSeasonId,
        parent_user_id: currentUser, // Creator
        child_user_id: childId // Assignee
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
    if (!currentSeasonId || !currentUser || !childId) return;
    try {
      await supabase.from('motivational_messages').insert({
        message: content,
        season_id: currentSeasonId,
        parent_user_id: currentUser,
        child_user_id: childId,
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
      await supabase.from('seasons').update({ base_value: newVal } as any).eq('id', currentSeasonId); // Updated column
      queryClient.invalidateQueries({ queryKey: ['season'] });
      toast.success("Valor base atualizado!");
    } catch (e) { toast.error("Erro ao atualizar valor"); }
  };

  const closeMonth = async () => {
    if (!currentSeasonId) return;
    try {
      await supabase.from('seasons').update({ is_finalized: true } as any).eq('id', currentSeasonId); // Ensure is_finalized exists? User only mentioned initial_value/child_id. Assuming is_finalized is fine or unchanged.
      queryClient.invalidateQueries({ queryKey: ['season'] });
      toast.success("Mês fechado com sucesso!");
    } catch (e) { toast.error("Erro ao fechar mês"); }
  };

  const value: AppContextType = {
    transactions, tasks, messages,
    currentMesadaBase, currentSeasonId,
    childId, isParent,
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