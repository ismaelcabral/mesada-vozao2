import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function MesadaHistoryPage() {
  const navigate = useNavigate();
  const {
    getMesadaAdjustments,
    getCurrentMesadaBase,
    getFinalMesada,
  } = useApp();

  const adjustments = getMesadaAdjustments();
  const currentBase = getCurrentMesadaBase();
  const finalMesada = getFinalMesada();

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">💰 Histórico da Mesada</h1>
        <Button onClick={() => navigate('/child/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          ℹ️ <strong>Informação:</strong> Aqui você pode ver o histórico de alterações da sua mesada. 
          Seus pais podem ajustar o valor base quando necessário.
        </p>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Mesada Base Atual</p>
            <p className="text-3xl font-bold text-indigo-600">R$ {currentBase.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Mesada Final (com bônus/descontos)</p>
            <p className="text-3xl font-bold text-green-600">R$ {finalMesada.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* HISTÓRICO */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Alterações Registradas</h2>
        {adjustments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma alteração de mesada registrada ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {adjustments.slice().reverse().map((adj) => (
              <Card key={adj.id} className="border-l-4 border-l-indigo-400">
                <CardContent className="py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">{adj.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Anterior:</span>
                      <span className="font-medium">R$ {adj.previousAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Novo Valor:</span>
                      <span className="font-medium">R$ {adj.newAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diferença:</span>
                      <span className={`font-bold ${adj.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adj.difference >= 0 ? '+' : ''}R$ {adj.difference.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Motivo:</span>
                      <p className="font-medium mt-1">{adj.reason}</p>
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
