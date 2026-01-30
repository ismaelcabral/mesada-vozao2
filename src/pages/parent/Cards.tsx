import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const PREDEFINED_YELLOW = [
  'Esqueceu descarga',
  'Louça na mesa',
  'Brinquedos espalhados',
  'Responder mal',
  'Não cumprir combinado simples',
];

const PREDEFINED_RED = [
  'Mentir',
  'Desrespeito sério',
  'Repetir a mesma falta muitas vezes',
];

export default function ParentCards() {
  const navigate = useNavigate();
  const { addCard, deleteCard, getCards, getYellowCardCount, getRedCardCount } = useApp();
  const [customYellow, setCustomYellow] = useState('');
  const [customRed, setCustomRed] = useState('');
  const [showCustomYellow, setShowCustomYellow] = useState(false);
  const [showCustomRed, setShowCustomRed] = useState(false);

  const handleQuickCard = (reason: string, type: 'yellow' | 'red') => {
    addCard(reason, type);
    toast.success(type === 'yellow' ? '🟨 Cartão amarelo registrado! -R$5' : '🔴 Cartão vermelho registrado! -R$15');
  };

  const handleCustomYellowCard = () => {
    if (!customYellow.trim()) {
      toast.error('Informe o motivo do cartão');
      return;
    }
    addCard(customYellow, 'yellow');
    toast.success('🟨 Cartão amarelo registrado! -R$5');
    setCustomYellow('');
    setShowCustomYellow(false);
  };

  const handleCustomRedCard = () => {
    if (!customRed.trim()) {
      toast.error('Informe o motivo do cartão');
      return;
    }
    addCard(customRed, 'red');
    toast.success('🔴 Cartão vermelho registrado! -R$15');
    setCustomRed('');
    setShowCustomRed(false);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    toast.success('Cartão removido!');
  };

  const cards = getCards();
  const yellowCount = getYellowCardCount();
  const redCount = getRedCardCount();

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📋 Registrar Cartões</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          ℹ️ <strong>Como funciona:</strong> Clique em um motivo predefinido ou adicione um customizado. 
          Cartão amarelo: -R$5 (máx 6). Cartão vermelho: -R$15 (máx 2).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CARTÕES AMARELOS */}
        <Card className="border-yellow-300 border-2">
          <CardHeader className="bg-yellow-50">
          <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-3xl">🟨</span>
              Amarelos ({yellowCount}/6)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {PREDEFINED_YELLOW.map((reason) => (
              <Button
                key={reason}
                onClick={() => handleQuickCard(reason, 'yellow')}
                disabled={yellowCount >= 6}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
              >
                {reason}
              </Button>
            ))}

            {!showCustomYellow ? (
              <Button
                onClick={() => setShowCustomYellow(true)}
                variant="secondary"
                className="w-full"
                disabled={yellowCount >= 6}
              >
                + Adicionar Customizado
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  value={customYellow}
                  onChange={(e) => setCustomYellow(e.target.value)}
                  placeholder="Digite o motivo"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomYellowCard}
                    disabled={yellowCount >= 6}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Registrar
                  </Button>
                  <Button
                    onClick={() => { setShowCustomYellow(false); setCustomYellow(''); }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARTÕES VERMELHOS */}
        <Card className="border-red-300 border-2">
          <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-3xl">🔴</span>
              Vermelhos ({redCount}/2)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {PREDEFINED_RED.map((reason) => (
              <Button
                key={reason}
                onClick={() => handleQuickCard(reason, 'red')}
                disabled={redCount >= 2}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 border-red-200 hover:bg-red-50"
              >
                {reason}
              </Button>
            ))}

            {!showCustomRed ? (
              <Button
                onClick={() => setShowCustomRed(true)}
                variant="secondary"
                className="w-full"
                disabled={redCount >= 2}
              >
                + Adicionar Customizado
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  value={customRed}
                  onChange={(e) => setCustomRed(e.target.value)}
                  placeholder="Digite o motivo"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomRedCard}
                    disabled={redCount >= 2}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Registrar
                  </Button>
                  <Button
                    onClick={() => { setShowCustomRed(false); setCustomRed(''); }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* HISTÓRICO */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Histórico do Mês</h2>
        {cards.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum cartão registrado ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <Card key={card.id} className={card.type === 'yellow' ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-red-500'}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold">
                        {card.type === 'yellow' ? '🟨 Amarelo' : '🔴 Vermelho'}
                      </p>
                      <p className="text-muted-foreground">{card.reason}</p>
                      <p className="text-xs text-muted-foreground">{card.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-red-600 font-bold text-lg">-R${card.amount}</p>
                      <Button
                        onClick={() => handleDeleteCard(card.id)}
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
