import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function ParentMessages() {
  const navigate = useNavigate();
  const { addMessage, getMessages } = useApp();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'praise' | 'incentive' | 'feedback'>('incentive');

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Escreva uma mensagem');
      return;
    }
    addMessage({
      type: messageType,
      content: message,
    });
    toast.success('💬 Mensagem enviada com sucesso!');
    setMessage('');
  };

  const messages = getMessages();

  const typeLabels = {
    praise: 'Elogio 👏',
    incentive: 'Incentivo 💪',
    feedback: 'Feedback 📝',
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">💬 Mensagens Motivacionais</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          ℹ️ <strong>Como funciona:</strong> Envie mensagens motivacionais para seu filho. 
          Ele verá todas as mensagens que você enviar no dashboard dele. 
          Use para elogiar, incentivar ou dar feedback construtivo!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Mensagem</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value as 'praise' | 'incentive' | 'feedback')}
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              <option value="praise">Elogio 👏</option>
              <option value="incentive">Incentivo 💪</option>
              <option value="feedback">Feedback 📝</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva uma mensagem motivacional..."
              className="w-full border rounded-md px-3 py-2 h-24 bg-background resize-none"
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            className="w-full"
          >
            Enviar Mensagem
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Mensagens Enviadas ({messages.length})</h2>
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma mensagem enviada ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-muted-foreground">
                        {typeLabels[msg.type]}
                      </p>
                      <p className="text-lg mt-2">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-muted-foreground">{msg.createdAt}</p>
                        {msg.read && <span className="text-xs text-green-600">✓ Lida</span>}
                      </div>
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