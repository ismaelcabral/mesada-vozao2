import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function ChildMessages() {
  const navigate = useNavigate();
  const { getMessages, getUnreadMessages, markMessageAsRead } = useApp();

  const allMessages = getMessages();
  const unreadMessages = getUnreadMessages();
  const readMessages = allMessages.filter(m => m.read);

  const typeLabels = {
    praise: '👏 Elogio',
    incentive: '💪 Incentivo',
    feedback: '📝 Feedback',
  };

  const typeColors = {
    praise: 'bg-yellow-50 border-l-yellow-400',
    incentive: 'bg-green-50 border-l-green-400',
    feedback: 'bg-blue-50 border-l-blue-400',
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">💬 Mensagens dos Pais</h1>
        <Button onClick={() => navigate('/child/home')} variant="outline">
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">📬 Novas ({unreadMessages.length})</h2>
        {unreadMessages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma mensagem nova
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {unreadMessages.map((msg) => (
              <Card key={msg.id} className={`border-l-4 ${typeColors[msg.type]}`}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-primary">
                        {typeLabels[msg.type]} ✨
                      </p>
                      <p className="text-lg mt-2">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{msg.createdAt}</p>
                    </div>
                    <Button 
                      onClick={() => markMessageAsRead(msg.id)}
                      variant="outline"
                      size="sm"
                    >
                      ✓ Marcar como lida
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">📭 Lidas ({readMessages.length})</h2>
        {readMessages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma mensagem lida
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {readMessages.map((msg) => (
              <Card key={msg.id} className="border-l-4 border-l-muted bg-muted/20">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {typeLabels[msg.type]}
                      </p>
                      <p className="text-muted-foreground">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{msg.createdAt}</p>
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
