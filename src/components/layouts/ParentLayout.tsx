import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ParentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/parent/home', label: '📊 Dashboard' },
    { path: '/parent/tasks', label: '✅ Tarefas' },
    { path: '/parent/cards', label: '🟨 Cartões' },
    { path: '/parent/goals', label: '⚽ Gols' },
    { path: '/parent/messages', label: '💬 Mensagens' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚽</span>
              <div>
                <h1 className="text-xl font-bold">Mesada do Vozão</h1>
                <p className="text-sm opacity-90">Painel dos Pais</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
              >
                Início
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}


      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
