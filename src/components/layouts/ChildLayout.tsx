import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChildLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/child/home', label: '🏠 Desempenho' },
    { path: '/child/tasks', label: '✅ Tarefas' },
    { path: '/child/messages', label: '💬 Mensagens' },
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
                <p className="text-sm opacity-90">Sua Temporada</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:block">Bem-vindo!</span>
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
