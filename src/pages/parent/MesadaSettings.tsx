import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function MesadaSettingsPage() {
  const navigate = useNavigate();
  const {
    adjustMesada,
    getMesadaAdjustments,
    getCurrentMesadaBase,
    getFinalMesada,
  } = useApp();

  const [newAmount, setNewAmount] = useState('');
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);

  const currentBase = getCurrentMesadaBase();
  const adjustments = getMesadaAdjustments();
  const finalMesada = getFinalMesada();

  const handleAdjust = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    if (!reason.trim()) {
      toast.error('Informe o motivo da alteração');
      return;
    }
    
    adjustMesada(amount, reason);
    toast.success('💰 Mesada ajustada com sucesso!');
    setNewAmount('');
    setReason('');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">💰 Configurar Mesada</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800">
          ℹ️ <strong>Como funciona:</strong> Altere o valor base da mesada. 
          Cada alteração fica registrada no histórico com data, valor anterior e novo valor.
        </p>
      </div>

      {/* RESUMO ATUAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">Mesada Base Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">R$ {currentBase.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total de Ajustes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{adjustments.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Mesada Final (com bônus/descontos)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">R$ {finalMesada.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* FORMULÁRIO DE AJUSTE */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
        >
          + Ajustar Mesada
        </Button>
      ) : (
        <Card className="border-indigo-300">
          <CardHeader>
            <CardTitle className="text-foreground">Novo Valor de Mesada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Novo Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Ex: 180.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Motivo da Alteração</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Aumento por bom comportamento"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdjust}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Confirmar Ajuste
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setNewAmount('');
                  setReason('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HISTÓRICO DE AJUSTES */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Histórico de Alterações</h2>
        {adjustments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma alteração de mesada registrada
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {adjustments.slice().reverse().map((adj) => (
              <Card key={adj.id} className="border-l-4 border-l-indigo-400">
                <CardContent className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Data</p>
                      <p className="font-bold">{adj.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Anterior</p>
                      <p className="font-bold">R$ {adj.previousAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Novo Valor</p>
                      <p className="font-bold">R$ {adj.newAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diferença</p>
                      <p className={`font-bold ${adj.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adj.difference >= 0 ? '+' : ''}R$ {adj.difference.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Motivo</p>
                      <p className="font-medium">{adj.reason}</p>
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
