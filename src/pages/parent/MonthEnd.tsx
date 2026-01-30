import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function MonthEndPage() {
  const navigate = useNavigate();
  const {
    getYellowCardCount,
    getRedCardCount,
    getGoalCount,
    getTotalGoalsValue,
    getCardPenalty,
    getFinalMesada,
    getClassification,
    monthlyRecords,
    getCurrentMonth,
    closeMonth,
  } = useApp();

  const yellowCards = getYellowCardCount();
  const redCards = getRedCardCount();
  const totalGoals = getGoalCount();
  const totalBonus = getTotalGoalsValue();
  const totalPenalty = getCardPenalty();
  const finalMesada = getFinalMesada();
  const classification = getClassification();
  const { month, year } = getCurrentMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleCloseMonth = () => {
    if (window.confirm('Tem certeza que deseja fechar o mês? Isso não pode ser desfeito.\n\n• Cartões e gols serão zerados\n• Tarefas não concluídas passarão para o próximo mês\n• O registro do mês será salvo no histórico')) {
      closeMonth();
      toast.success('📅 Mês fechado com sucesso! Novo mês iniciado.');
      navigate('/parent/home');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📅 Fechamento do Mês</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ <strong>Atenção:</strong> Ao fechar o mês, todos os dados serão contabilizados e salvos no histórico. 
          Cartões e gols serão zerados. Tarefas não concluídas passarão para o próximo mês como "atrasadas".
        </p>
      </div>

      {/* RESUMO DO MÊS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cartões Amarelos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">🟨 {yellowCards}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cartões Vermelhos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">🔴 {redCards}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gols Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">⚽ {totalGoals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bônus Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+R${totalBonus}</p>
          </CardContent>
        </Card>
      </div>

      {/* CÁLCULO FINAL */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Cálculo Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>Mesada Inicial:</span>
            <span className="font-medium">R$ 150,00</span>
          </div>
          <div className="flex justify-between text-lg text-green-600">
            <span>+ Bônus (Gols):</span>
            <span className="font-medium">+R$ {totalBonus.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg text-red-600">
            <span>- Descontos (Cartões):</span>
            <span className="font-medium">-R$ {totalPenalty.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-xl font-bold">
            <span>Mesada Final:</span>
            <span className="text-primary">R$ {finalMesada.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            (Mínimo garantido: R$ 80,00)
          </p>
        </CardContent>
      </Card>

      {/* CLASSIFICAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Classificação Final</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold mb-2">{classification}</p>
          <p className="text-muted-foreground">
            {classification.includes('Campeão') && 'Parabéns! Desempenho excelente!'}
            {classification.includes('Série A') && 'Ótimo desempenho! Continue assim!'}
            {classification.includes('Série B') && 'Bom esforço! Tem potencial para melhorar!'}
            {classification.includes('Rebaixamento') && 'Oportunidade de recuperação no próximo mês!'}
          </p>
        </CardContent>
      </Card>

      {/* BOTÃO DE FECHAMENTO */}
      <Button
        onClick={handleCloseMonth}
        className="w-full h-16 text-xl bg-amber-600 hover:bg-amber-700"
      >
        ✅ Fechar Mês de {monthNames[month - 1]}/{year}
      </Button>

      {/* HISTÓRICO DE MESES */}
      {monthlyRecords.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">📊 Histórico de Meses</h2>
          <div className="space-y-3">
            {monthlyRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="py-4">
                  <div className="grid grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Mês</p>
                      <p className="font-bold">{monthNames[record.month - 1]}/{record.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cartões</p>
                      <p className="font-medium">🟨 {record.yellowCards} 🔴 {record.redCards}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gols</p>
                      <p className="font-medium">⚽ {record.totalGoals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mesada</p>
                      <p className="font-bold text-primary">R$ {record.finalMesada.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Classificação</p>
                      <p className="font-medium text-sm">{record.classification}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
