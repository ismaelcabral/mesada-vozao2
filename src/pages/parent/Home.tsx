import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { Pencil, Trophy, AlertTriangle, CheckCircle, Plus, Trash2, MessageSquare, List } from 'lucide-react';

// UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ParentHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    transactions,
    tasks,
    messages,
    currentMesadaBase,
    currentSeasonId,
    addTransaction,
    deleteTransaction,
    addTask,
    deleteTask,
    sendMessage,
    updateMesadaBase,
    closeMonth
  } = useApp();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("dashboard");

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [isCloseMonthOpen, setIsCloseMonthOpen] = useState(false);
  const [isEditBaseOpen, setIsEditBaseOpen] = useState(false);

  // Forms
  const [cardType, setCardType] = useState<'yellow_card' | 'red_card'>('yellow_card');
  const [cardReason, setCardReason] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalAmount, setGoalAmount] = useState('2');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [baseValueInput, setBaseValueInput] = useState(currentMesadaBase.toString());

  // --- CALCS ---
  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const finalMesada = Math.max(0, currentMesadaBase + totalBalance);

  const yellowCards = transactions.filter(t => t.type === 'yellow_card');
  const redCards = transactions.filter(t => t.type === 'red_card');
  const goals = transactions.filter(t => t.type === 'goal');

  // --- CLASSIFICATION LOGIC ---
  const classification = (() => {
    // 🥇 CAMPEÃO DO VOZÃO: Se (Amarelos <= 4) E (Vermelhos == 0)
    if (yellowCards.length <= 4 && redCards.length === 0) return { title: '🏆 Campeão do Vozão', color: 'text-yellow-400', bg: 'from-yellow-900/40 to-yellow-600/20' };
    // 🥈 SÉRIE A: Se (Amarelos <= 6) E (Vermelhos <= 1)
    if (yellowCards.length <= 6 && redCards.length <= 1) return { title: '🥈 Série A', color: 'text-slate-300', bg: 'from-slate-800 to-slate-700/50' };
    // 🥉 SÉRIE B: Se (Amarelos entre 7 e 9) E (Vermelhos <= 2)
    if (yellowCards.length <= 9 && redCards.length <= 2) return { title: '🥉 Série B', color: 'text-orange-400', bg: 'from-orange-900/40 to-orange-600/20' };
    // 🚨 ZONA DE REBAIXAMENTO
    return { title: '🚨 Zona de Rebaixamento', color: 'text-red-500', bg: 'from-red-900/40 to-red-600/20' };
  })();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // --- MUTATIONS ---
  const cardMutation = useMutation({
    mutationFn: async () => {
      if (!currentSeasonId) {
        alert("Erro: Temporada não identificada. Por favor, recarregue a página.");
        return;
      }
      // Red Card now -15
      const amount = cardType === 'yellow_card' ? -5 : -15;
      await addTransaction(cardType, cardReason, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsCardOpen(false); setCardReason(''); setCardType('yellow_card');
    }
  });

  const goalMutation = useMutation({
    mutationFn: async () => {
      if (!currentSeasonId) {
        alert("Erro: Temporada não identificada. Por favor, recarregue a página.");
        return;
      }
      await addTransaction('goal', goalDesc, parseFloat(goalAmount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsGoalOpen(false); setGoalDesc(''); setGoalAmount('2');
    }
  });

  const taskMutation = useMutation({
    mutationFn: async () => {
      await addTask({ title: taskTitle, description: '', deadline: taskDeadline || new Date().toISOString(), completed: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsTaskOpen(false); setTaskTitle(''); setTaskDeadline('');
    }
  });

  const msgMutation = useMutation({
    mutationFn: async () => {
      await sendMessage(msgContent);
    },
    onSuccess: () => {
      setIsMsgOpen(false); setMsgContent('');
    }
  });

  const baseMutation = useMutation({
    mutationFn: async () => {
      await updateMesadaBase(parseFloat(baseValueInput));
    },
    onSuccess: () => {
      setIsEditBaseOpen(false);
    }
  });

  const closeMonthMutation = useMutation({
    mutationFn: async () => {
      await closeMonth();
    },
    onSuccess: () => {
      setIsCloseMonthOpen(false);
    }
  });

  const deleteTxMutation = useMutation({
    mutationFn: async (id: number) => { await deleteTransaction(id); },
    onSuccess: () => toast.success("Item removido")
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => { await deleteTask(id); },
    onSuccess: () => toast.success("Tarefa removida")
  });


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 space-y-6 pb-20 font-body">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-wide text-white">Painel do Pai</h1>
          <p className="text-xs text-slate-400">Mesada do Vozão</p>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">Sair</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsList className="w-full justify-start overflow-x-auto bg-slate-900/50 p-1 rounded-xl border border-slate-800 h-auto">
          <TabsTrigger value="dashboard" className="px-4 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks" className="px-4 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Tarefas</TabsTrigger>
          <TabsTrigger value="cards" className="px-4 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Cartões</TabsTrigger>
          <TabsTrigger value="goals" className="px-4 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Gols</TabsTrigger>
          <TabsTrigger value="messages" className="px-4 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Mensagens</TabsTrigger>
        </TabsList>

        {/* --- DASHBOARD TAB --- */}
        <TabsContent value="dashboard" className="space-y-6 animate-slide-up">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Trophy size={60} className="text-emerald-500" /></div>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-400">Mesada Final</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-emerald-500">R${finalMesada.toFixed(2)}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6 mb-1 text-slate-500 hover:text-white"
                    onClick={() => { setBaseValueInput(currentMesadaBase.toString()); setIsEditBaseOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Base: R${currentMesadaBase}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-500">Amarelos</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-yellow-500">{yellowCards.length}</p></CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-red-500">Vermelhos</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-red-500">{redCards.length}</p></CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-500">Gols</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-blue-500">{goals.length}</p></CardContent>
            </Card>
          </div>

          <Card className={`bg-gradient-to-r ${classification.bg} text-white border-slate-700`}>
            <CardContent className="pt-6 flex items-center gap-4">
              <Trophy className={`h-10 w-10 ${classification.color}`} />
              <div>
                <p className="text-2xl font-bold font-display tracking-widest">{classification.title}</p>
                <p className="text-sm text-slate-200 opacity-90">Status Atual</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid (Restored) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => setIsCardOpen(true)} className="h-24 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-red-500 text-white rounded-xl space-y-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <span className="font-bold">Aplicar Cartão</span>
            </Button>

            <Button onClick={() => setIsGoalOpen(true)} className="h-24 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-emerald-500 text-white rounded-xl space-y-2">
              <Trophy className="h-8 w-8 text-emerald-500" />
              <span className="font-bold">Registrar Gol</span>
            </Button>

            <Button onClick={() => setIsTaskOpen(true)} className="h-24 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-blue-500 text-white rounded-xl space-y-2">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <span className="font-bold">Nova Tarefa</span>
            </Button>

            <Button onClick={() => setIsMsgOpen(true)} className="h-24 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-purple-500 text-white rounded-xl space-y-2">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <span className="font-bold">Mensagem</span>
            </Button>

            <Button onClick={() => { setBaseValueInput(currentMesadaBase.toString()); setIsEditBaseOpen(true); }} className="h-24 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-yellow-500 text-white rounded-xl space-y-2">
              <Pencil className="h-8 w-8 text-yellow-500" />
              <span className="font-bold">Configurar</span>
            </Button>

            <Button onClick={() => setIsCloseMonthOpen(true)} className="h-24 flex flex-col items-center justify-center bg-amber-900/20 border border-amber-900/50 hover:bg-amber-900/40 text-amber-500 rounded-xl space-y-2">
              <List className="h-8 w-8" />
              <span className="font-bold">Fechar Mês</span>
            </Button>
          </div>
        </TabsContent>

        {/* --- TASKS TAB --- */}
        <TabsContent value="tasks" className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Tarefas</h2>
            <Button onClick={() => setIsTaskOpen(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" /> Nova Tarefa</Button>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              {tasks.length === 0 ? <p className="p-8 text-center text-slate-500">Nenhuma tarefa.</p> : (
                <div className="divide-y divide-slate-800">
                  {tasks.map(t => (
                    <div key={t.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-slate-200 ${t.completed ? 'line-through text-slate-500' : ''}`}>{t.title}</p>
                        <p className="text-xs text-slate-500">Prazo: {new Date(t.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.completed && <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-900">Feita</Badge>}
                        <Button variant="ghost" size="icon" onClick={() => deleteTaskMutation.mutate(t.id)}><Trash2 className="h-4 w-4 text-red-500/50 hover:text-red-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CARDS TAB --- */}
        <TabsContent value="cards" className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Cartões</h2>
            <Button onClick={() => setIsCardOpen(true)} variant="destructive"><Plus className="mr-2 h-4 w-4" /> Aplicar Cartão</Button>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              {transactions.filter(t => t.type !== 'goal').length === 0 ? <p className="p-8 text-center text-slate-500">Nenhum cartão.</p> : (
                <div className="divide-y divide-slate-800">
                  {transactions.filter(t => t.type !== 'goal').map(t => (
                    <div key={t.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-4 rounded-sm ${t.type === 'yellow_card' ? 'bg-yellow-500' : 'bg-red-600'}`}></div>
                        <div>
                          <p className="font-medium text-slate-200">{t.description}</p>
                          <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-400">-R${Math.abs(t.amount)}</span>
                        <Button variant="ghost" size="icon" onClick={() => deleteTxMutation.mutate(t.id)}><Trash2 className="h-4 w-4 text-slate-600 hover:text-red-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- GOALS TAB --- */}
        <TabsContent value="goals" className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Gols</h2>
            <Button onClick={() => setIsGoalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="mr-2 h-4 w-4" /> Registrar Gol</Button>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              {goals.length === 0 ? <p className="p-8 text-center text-slate-500">Nenhum gol.</p> : (
                <div className="divide-y divide-slate-800">
                  {goals.map(t => (
                    <div key={t.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-200">{t.description}</p>
                        <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-500">+R${t.amount}</span>
                        <Button variant="ghost" size="icon" onClick={() => deleteTxMutation.mutate(t.id)}><Trash2 className="h-4 w-4 text-slate-600 hover:text-red-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- MESSAGES TAB --- */}
        <TabsContent value="messages" className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Mensagens</h2>
            <Button onClick={() => setIsMsgOpen(true)} variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700"><MessageSquare className="mr-2 h-4 w-4" /> Enviar Nova</Button>
          </div>
          <div className="grid gap-4">
            {messages.map(m => (
              <Card key={m.id} className={`border-slate-800 ${m.read ? 'bg-slate-900/50' : 'bg-slate-900 border-l-4 border-l-blue-500'}`}>
                <CardContent className="p-4">
                  <p className="text-sm mb-2 text-slate-200">"{m.content}"</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">{m.read ? "Lida" : "Não lida"}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>

      {/* --- DIALOGS (Styled Dark) --- */}

      {/* CARD */}
      <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader><DialogTitle>Aplicar Cartão</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Tipo de Cartão</Label>
              <div className="flex gap-4">
                <div
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${cardType === 'yellow_card' ? 'bg-yellow-900/20 border-yellow-500 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'}`}
                  onClick={() => setCardType('yellow_card')}
                >
                  <div className="w-8 h-10 bg-yellow-500 rounded-sm mb-2 shadow-lg" />
                  <p className="font-bold text-yellow-500">Amarelo (R$ 5)</p>
                  <p className="text-xs text-slate-400 mt-1">Infrações leves</p>
                </div>
                <div
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${cardType === 'red_card' ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'}`}
                  onClick={() => setCardType('red_card')}
                >
                  <div className="w-8 h-10 bg-red-600 rounded-sm mb-2 shadow-lg" />
                  <p className="font-bold text-red-500">Vermelho (R$ 15)</p>
                  <p className="text-xs text-slate-400 mt-1">Infrações graves</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Motivos Comuns</Label>
              <div className="flex flex-wrap gap-2">
                {cardType === 'yellow_card' ? (
                  <>
                    {['Esqueceu descarga', 'Louça na mesa', 'Brinquedos espalhados', 'Responder mal', 'Quebrou combinado'].map(reason => (
                      <Badge key={reason} variant="secondary" className="bg-slate-800 hover:bg-yellow-900/40 hover:text-yellow-500 cursor-pointer py-1 px-3" onClick={() => setCardReason(reason)}>
                        {reason}
                      </Badge>
                    ))}
                  </>
                ) : (
                  <>
                    {['Mentir', 'Desrespeito', 'Reincidência'].map(reason => (
                      <Badge key={reason} variant="secondary" className="bg-slate-800 hover:bg-red-900/40 hover:text-red-500 cursor-pointer py-1 px-3" onClick={() => setCardReason(reason)}>
                        {reason}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2"><Label className="text-slate-300">Motivo (Personalizado)</Label><Input value={cardReason} onChange={e => setCardReason(e.target.value)} className="bg-slate-950 border-slate-800 text-white" placeholder="Digite ou selecione acima..." /></div>
          </div>
          <DialogFooter><Button onClick={() => cardMutation.mutate()} variant="destructive" disabled={!cardReason}>Confirmar Cartão</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GOAL */}
      <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader><DialogTitle>Registrar Gol</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Gols Rápidos</Label>
              <div className="flex flex-wrap gap-2">
                {['Arrumou quarto', 'Dever sem reclamar', 'Ajudou em casa'].map(r => (
                  <Badge key={r} variant="secondary" className="bg-slate-800 hover:bg-emerald-900/40 hover:text-emerald-500 cursor-pointer py-1 px-3" onClick={() => { setGoalDesc(r); setGoalAmount('5'); }}>
                    ⚽ {r} (R$ 5)
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-slate-800 hover:bg-purple-900/40 hover:text-purple-400 cursor-pointer py-1 px-3 border border-purple-500/30" onClick={() => { setGoalDesc('Elogio da Escola'); setGoalAmount('10'); }}>
                  🌟 Super Gol: Elogio da Escola (R$ 10)
                </Badge>
              </div>
            </div>

            <div className="space-y-2"><Label className="text-slate-300">Descrição</Label><Input value={goalDesc} onChange={e => setGoalDesc(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div>
            <div className="space-y-2"><Label className="text-slate-300">Valor</Label><Input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div>
          </div>
          <DialogFooter><Button onClick={() => goalMutation.mutate()} className="bg-emerald-600 hover:bg-emerald-700" disabled={!goalDesc}>Confirmar Gol</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TASK */}
      <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label className="text-slate-300">Título</Label><Input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div>
            <div className="space-y-2"><Label className="text-slate-300">Prazo</Label><Input type="date" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div>
          </div>
          <DialogFooter><Button onClick={() => taskMutation.mutate()} className="bg-blue-600 hover:bg-blue-700">Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MESSAGE */}
      <Dialog open={isMsgOpen} onOpenChange={setIsMsgOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader><DialogTitle>Enviar Mensagem</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label className="text-slate-300">Recado</Label><Textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div>
          </div>
          <DialogFooter><Button onClick={() => msgMutation.mutate()} className="bg-purple-600 hover:bg-purple-700">Enviar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT BASE */}
      <Dialog open={isEditBaseOpen} onOpenChange={setIsEditBaseOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader><DialogTitle>Alterar Valor Base</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4"><div className="space-y-2"><Label className="text-slate-300">Novo Valor (R$)</Label><Input type="number" value={baseValueInput} onChange={e => setBaseValueInput(e.target.value)} className="bg-slate-950 border-slate-800 text-white" /></div></div>
          <DialogFooter><Button onClick={() => baseMutation.mutate()} className="bg-yellow-600 hover:bg-yellow-700">Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CLOSE MONTH */}
      <Dialog open={isCloseMonthOpen} onOpenChange={setIsCloseMonthOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-amber-500" /> Fechar Mês?</DialogTitle><DialogDescription className="text-slate-400">Isso finalizará o mês atual.</DialogDescription></DialogHeader>
          <div className="py-6 text-center space-y-2 bg-slate-950/50 rounded-lg border border-slate-800">
            <p className="text-sm text-slate-400">Valor Final</p>
            <p className="text-4xl font-bold text-emerald-500">R${finalMesada.toFixed(2)}</p>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCloseMonthOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancelar</Button><Button onClick={() => closeMonthMutation.mutate()} className="bg-amber-600 hover:bg-amber-700">Confirmar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}