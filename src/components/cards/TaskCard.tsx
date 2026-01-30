import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  title: string;
  description?: string | null;
  deadline?: string | null;
  value?: number | null;
  status?: string | null;
  completedAt?: string | null;
  onComplete?: () => void;
  showCompleteButton?: boolean;
}

export function TaskCard({
  title,
  description,
  deadline,
  value,
  status = 'pending',
  completedAt,
  onComplete,
  showCompleteButton = false,
}: TaskCardProps) {
  const isCompleted = status === 'completed';
  const isOverdue = status === 'overdue';

  const statusConfig = {
    pending: { label: '⏳ Pendente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    completed: { label: '✅ Concluída', bg: 'bg-green-100', text: 'text-green-800' },
    overdue: { label: '❌ Atrasada', bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Card className={cn(
      "transition-all duration-200",
      isCompleted && "opacity-75",
      isOverdue && "border-red-300"
    )}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className={cn(
              "font-bold text-lg",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {deadline && (
                <span className="text-sm text-muted-foreground">
                  📅 {format(new Date(deadline), "dd 'de' MMMM", { locale: ptBR })}
                </span>
              )}
              
              {completedAt && isCompleted && (
                <span className="text-sm text-green-600">
                  ✓ {format(new Date(completedAt), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              )}
              
              {value && (
                <span className="text-green-600 font-bold">
                  +R$ {parseFloat(value.toString()).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "px-3 py-1 rounded text-sm font-bold whitespace-nowrap",
              config.bg,
              config.text
            )}>
              {config.label}
            </span>
            
            {showCompleteButton && !isCompleted && onComplete && (
              <Button onClick={onComplete} size="sm" variant="default">
                ✅ Concluir
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
