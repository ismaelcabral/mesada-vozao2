import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageCardProps {
  message: string;
  messageType?: string | null;
  createdAt?: string | null;
  isRead?: boolean | null;
  onMarkAsRead?: () => void;
  showMarkAsReadButton?: boolean;
}

const messageTypeConfig: Record<string, { emoji: string; label: string; borderColor: string }> = {
  general: { emoji: '💬', label: 'Mensagem', borderColor: 'border-l-primary' },
  achievement: { emoji: '🏆', label: 'Conquista', borderColor: 'border-l-yellow-500' },
  encouragement: { emoji: '💪', label: 'Encorajamento', borderColor: 'border-l-green-500' },
  warning: { emoji: '⚠️', label: 'Aviso', borderColor: 'border-l-orange-500' },
};

export function MessageCard({
  message,
  messageType = 'general',
  createdAt,
  isRead = false,
  onMarkAsRead,
  showMarkAsReadButton = false,
}: MessageCardProps) {
  const config = messageTypeConfig[messageType || 'general'] || messageTypeConfig.general;

  return (
    <Card className={cn(
      "transition-all duration-200 border-l-4",
      config.borderColor,
      !isRead && "bg-primary/5 shadow-md"
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{config.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {config.label}
              </span>
              {!isRead && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  Nova
                </span>
              )}
            </div>
            
            <p className={cn(
              "font-medium",
              isRead && "text-muted-foreground"
            )}>
              {message}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              {createdAt && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </span>
              )}
              
              {showMarkAsReadButton && !isRead && onMarkAsRead && (
                <Button onClick={onMarkAsRead} size="sm" variant="outline">
                  ✓ Marcar como lida
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
