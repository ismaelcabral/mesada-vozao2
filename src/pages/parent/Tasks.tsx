import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function ParentTasks() {
  const navigate = useNavigate();
  const { addTask, deleteTask, getTasks, getActiveTasks, getCompletedTasks } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleCreateTask = () => {
    if (!title.trim()) {
      toast.error('Informe o título da tarefa');
      return;
    }
    if (!deadline) {
      toast.error('Informe o prazo da tarefa');
      return;
    }
    addTask({
      title,
      description,
      deadline,
      completed: false,
    });
    toast.success('📝 Tarefa criada com sucesso!');
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success('Tarefa removida!');
  };

  const pendingTasks = getActiveTasks();
  const completedTasks = getCompletedTasks();

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📝 Gerenciar Tarefas</h1>
        <Button onClick={() => navigate('/parent/home')} variant="outline">
          ← Voltar
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          ℹ️ <strong>Como funciona:</strong> Crie tarefas para seu filho fazer. 
          As tarefas não concluídas no final do mês passam para o próximo como "atrasadas".
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fazer a lição de casa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prazo</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateTask} 
            className="w-full"
          >
            Criar Tarefa
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">⏳ Pendentes ({pendingTasks.length})</h2>
        {pendingTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma tarefa pendente. Crie tarefas para seu filho completar!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-orange-400">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg">⏳ {task.title}</p>
                      <p className="text-muted-foreground">{task.description}</p>
                      <p className="text-sm text-muted-foreground">Prazo: {task.deadline}</p>
                      {task.delayedFromMonth && (
                        <p className="text-xs text-orange-600 font-medium mt-1">
                          ⚠️ Atrasada do mês {task.delayedFromMonth}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        Pendente
                      </span>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
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

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">✅ Concluídas ({completedTasks.length})</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-green-500">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg line-through text-muted-foreground">✅ {task.title}</p>
                      <p className="text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Concluída
                      </span>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
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
        </div>
      )}
    </div>
  );
}
