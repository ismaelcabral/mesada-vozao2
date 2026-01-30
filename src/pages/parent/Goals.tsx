import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const PREDEFINED_GOALS_SINGLE = [
  'Arrumou o quarto sem pedir',
  'Fez dever sem reclamar',
  'Ajudou espontaneamente',
  'Comportamento exemplar',
];

const PREDEFINED_GOALS_DOUBLE = [
  'Elogio da escola',
  'Superou um desafio importante',
  'Atitude extraordinária',
];

export default function ParentGoals() {
  const navigate = useNavigate();
  const { addGoal, deleteGoal, getGoals, getGoalCount, getTotalGoalsValue } = useApp();
  const [customDescription, setCustomDescription] = useState('');
  const [customIsDouble, setCustomIsDouble] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleQuickGoal = (description: string, isDouble: boolean) => {
    if (getGoalCount() >= 10) {
      toast.error('Limite de 10 gols atingido!');
      return;
    }
    addGoal(description, isDouble);
    toast.success(`⚽ Gol ${isDouble ? 'duplo' : 'simples'} registrado! +R$${isDouble ? 10 : 5}`);
  };

  const handleCustomGoal = () => {
    if (!customDescription.trim()) {
      toast.error('Informe a descrição do gol');
      return;
    }
    if (getGoalCount() >= 10) {
      toast.error('Limite de 10 gols atingido!');
      return;
    }
    addGoal(customDescription, customIsDouble);
    toast.success(`⚽ Gol ${customIsDouble ? 'duplo' : 'simples'} registrado! +R$${customIsDouble ? 10 : 5}`);
    setCustomDescription('');
    setCustomIsDouble(false);
    setShowCustom(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    toast.success('Gol removido!');
  };

  const goals = getGoals();
  const goalCount = getGoalCount();
  const totalBonus = getTotalGoalsValue();

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">⚽ Registrar Gols</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">
          ℹ️ <strong>Como funciona:</strong> Registre conquistas e bons comportamentos.
          Gol simples: +R$5. Gol duplo: +R$10. Máximo 10 gols pagos por mês.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* GOLS SIMPLES */}
        <Card className="border-green-300 border-2">
          <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">⚽</span>
              Gols Simples (+R$5)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {PREDEFINED_GOALS_SINGLE.map((desc) => (
              <Button
                key={desc}
                onClick={() => handleQuickGoal(desc, false)}
                disabled={goalCount >= 10}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 border-green-200 hover:bg-green-50"
              >
                {desc}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* GOLS DUPLOS */}
        <Card className="border-emerald-400 border-2">
          <CardHeader className="bg-emerald-50">
          <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">⚽⚽</span>
              Gols Duplos (+R$10)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {PREDEFINED_GOALS_DOUBLE.map((desc) => (
              <Button
                key={desc}
                onClick={() => handleQuickGoal(desc, true)}
                disabled={goalCount >= 10}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 border-emerald-200 hover:bg-emerald-50"
              >
                {desc}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* GOL CUSTOMIZADO */}
      <Card className="border-green-300">
        <CardHeader>
          <CardTitle>+ Gol Customizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <Input
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Ex: Ajudou o irmão com a tarefa"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isDouble"
              checked={customIsDouble}
              onCheckedChange={(checked) => setCustomIsDouble(checked === true)}
            />
            <label htmlFor="isDouble" className="text-sm cursor-pointer">
              Gol Duplo (+R$10) - Senão é Simples (+R$5)
            </label>
          </div>
          <Button
            onClick={handleCustomGoal}
            disabled={goalCount >= 10}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Registrar Gol
          </Button>
        </CardContent>
      </Card>

      {/* RESUMO */}
      <div className="bg-green-100 rounded-lg p-4 text-center">
        <p className="text-lg font-bold text-green-800">
          Total de Gols: {goalCount}/10 | Bônus: +R${totalBonus.toFixed(2)}
        </p>
      </div>

      {/* HISTÓRICO */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Gols do Mês</h2>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum gol registrado ainda. Gols adicionam bônus à mesada!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-green-500">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold">
                        {goal.isDouble ? '⚽⚽ Gol Duplo' : '⚽ Gol Simples'}
                      </p>
                      <p className="text-muted-foreground">{goal.description}</p>
                      <p className="text-xs text-muted-foreground">{goal.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-green-600 font-bold text-lg">+R${goal.amount}</p>
                      <Button
                        onClick={() => handleDeleteGoal(goal.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
