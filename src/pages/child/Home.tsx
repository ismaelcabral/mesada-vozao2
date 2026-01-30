import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';

// UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Bell, CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ChildHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    transactions,
    tasks,
    messages,
    currentMesadaBase,
    completeTask,
    markMessageAsRead
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard");

  // --- LOGIC ---
  const yellowCards = transactions.filter(t => t.type === 'yellow_card');
  const redCards = transactions.filter(t => t.type === 'red_card');
  const myGoals = transactions.filter(t => t.type === 'goal');

  const bonus = myGoals.reduce((acc, t) => acc + t.amount, 0);
  const penalty = [...yellowCards, ...redCards].reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const finalMesada = Math.max(0, currentMesadaBase + bonus - penalty);

  const classification = (() => {
    if (yellowCards.length <= 4 && redCards.length === 0) return '🏆 Campeão do Vozão';
    if (yellowCards.length <= 6 && redCards.length <= 1) return '🥈 Série A';
    if (yellowCards.length <= 9 && redCards.length <= 2) return '🥉 Série B';
    return '⬇️ Rebaixamento';
  })();

  const unreadMessages = messages.filter(m => !m.read);
  const activeTasks = tasks.filter(t => !t.completed);

  // Extract
  const extractItems = [
    ...transactions.map(t => ({ id: `tx-${t.id}`, date: new Date(t.date), desc: t.description || (t.type === 'goal' ? 'Gol' : 'Cartão'), val: t.amount, type: t.type })),
    ...tasks.filter(t => t.completed).map(t => ({ id: t.id, date: new Date(t.createdAt), desc: `Tarefa: ${t.title}`, val: 0, type: 'task' }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const completeTaskMutation = useMutation({
    mutationFn: async (id: string) => { await completeTask(id, true); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); toast.success("Tarefa concluída!"); }
  });

  const readMsgMutation = useMutation({
    mutationFn: async (id: string) => { await markMessageAsRead(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['messages'] }); }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 pb-24 font-body">
      <div className="flex items-center justify-between mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Meu Painel</h1>
          <p className="text-xs text-slate-400">Mesada do Vozão</p>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">Sair</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsList className="w-full justify-start overflow-x-auto bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <TabsTrigger value="dashboard" className="px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Resumo</TabsTrigger>
          <TabsTrigger value="tasks" className="px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">{activeTasks.length > 0 && <span className="bg-blue-500 w-2 h-2 rounded-full mr-2"></span>}Tarefas</TabsTrigger>
          <TabsTrigger value="extract" className="px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Extrato</TabsTrigger>
          <TabsTrigger value="messages" className="px-3 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">{unreadMessages.length > 0 && <span className="bg-red-500 w-2 h-2 rounded-full mr-2"></span>}Recados</TabsTrigger>
        </TabsList>

        {/* --- DASHBOARD TAB --- */}
        <TabsContent value="dashboard" className="space-y-4 animate-slide-up">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white border-none shadow-lg shadow-emerald-900/20">
            <CardHeader className="pb-2"><CardTitle className="text-emerald-50 opacity-90 text-sm">Minha Mesada</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">R${finalMesada.toFixed(2)}</p>
              <div className="mt-4 flex gap-2 text-xs bg-black/20 p-2 rounded-lg backdrop-blur-sm inline-flex">
                <span>Base: R${currentMesadaBase}</span> • <span className="text-emerald-200">+R${bonus}</span> • <span className="text-rose-200">-R${penalty}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Classificação</p>
                <p className="text-xl font-bold mt-1 text-white">{classification}</p>
              </div>
              <Trophy className="h-10 w-10 text-yellow-500" />
            </CardContent>
          </Card>

          {/* QUICK ACTIONS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-32 flex flex-col gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-blue-500 text-white rounded-xl shadow-sm" onClick={() => setActiveTab('tasks')}>
              <CheckCircle2 className="h-10 w-10 text-blue-500" />
              <span className="font-bold text-lg">Minhas Tarefas</span>
              <Badge variant="secondary" className="bg-slate-800 text-blue-200">{activeTasks.length} pendentes</Badge>
            </Button>

            <Button className="h-32 flex flex-col gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-emerald-500 text-white rounded-xl shadow-sm" onClick={() => setActiveTab('extract')}>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-yellow-500">{yellowCards.length}</span>
                  <Trophy className="h-3 w-3 text-yellow-500/50" />
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-emerald-500">{myGoals.length}</span>
                  <Trophy className="h-3 w-3 text-emerald-500/50" />
                </div>
              </div>
              <span className="font-bold text-lg">Ver Extrato</span>
            </Button>
          </div>
        </TabsContent>

        {/* --- TASKS TAB --- */}
        <TabsContent value="tasks" className="space-y-4 animate-slide-up">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Minhas Tarefas</CardTitle></CardHeader>
            <CardContent className="p-0">
              {activeTasks.length === 0 ? <p className="p-8 text-center text-slate-500">Tudo feito! Parabéns! 🎉</p> : (
                <div className="divide-y divide-slate-800">
                  {activeTasks.map(t => (
                    <div key={t.id} className="p-4 flex items-center space-x-3">
                      <Checkbox id={t.id} onCheckedChange={() => completeTaskMutation.mutate(t.id)} className="w-6 h-6 border-2 border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                      <div>
                        <label htmlFor={t.id} className="font-medium text-lg leading-none text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t.title}</label>
                        <p className="text-xs text-slate-500 mt-1">Prazo: {new Date(t.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- EXTRACT TAB --- */}
        <TabsContent value="extract" className="space-y-4 animate-slide-up">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Histórico Completo</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800">
                {extractItems.map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${item.type === 'goal' ? 'bg-emerald-900/30' : item.type === 'task' ? 'bg-blue-900/30' : 'bg-rose-900/30'}`}>
                        {item.type === 'goal' ? <Trophy className="h-4 w-4 text-emerald-500" /> : item.type === 'task' ? <CheckCircle2 className="h-4 w-4 text-blue-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-200">{item.desc}</p>
                        <p className="text-xs text-slate-500">{item.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    {item.val !== 0 && (
                      <span className={`font-bold ${item.val > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.val > 0 ? '+' : ''}{item.val.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- MESSAGES TAB --- */}
        <TabsContent value="messages" className="space-y-4 animate-slide-up">
          <div className="space-y-4">
            {messages.map(m => (
              <Card key={m.id} className={`border-slate-800 ${m.read ? 'bg-slate-900/30 opacity-60' : 'bg-slate-900 border-l-4 border-l-blue-500'}`}>
                <CardContent className="p-4">
                  <p className="mb-2 font-medium text-slate-200">"{m.content}"</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                    {!m.read ? <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-transparent p-0 h-auto" onClick={() => readMsgMutation.mutate(m.id)}>Marcar como lida</Button> : <span>Lida</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
            {messages.length === 0 && <p className="text-center text-slate-500 py-8">Nenhum recado por enquanto.</p>}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}