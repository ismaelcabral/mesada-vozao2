import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function ChildTasks() {
  const navigate = useNavigate();
  const { getActiveTasks, getCompletedTasks, completeTask } = useApp();

  const activeTasks = getActiveTasks();
  const completedTasks = getCompletedTasks();

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📝 Minhas Tarefas</h1>
        <Button onClick={() => navigate('/child/home')} variant="outline">
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">⏳ Pendentes ({activeTasks.length})</h2>
        {activeTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              🎉 Nenhuma tarefa pendente! Você está em dia!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-orange-400">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{task.title}</p>
                      <p className="text-muted-foreground">{task.description}</p>
                      <p className="text-sm text-orange-600 font-medium mt-1">
                        📅 Prazo: {task.deadline}
                      </p>
                    </div>
                    <Button 
                      onClick={() => completeTask(task.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✅ Concluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">✅ Concluídas ({completedTasks.length})</h2>
        {completedTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Complete tarefas para ver aqui!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-green-500 bg-green-50/50">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
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
