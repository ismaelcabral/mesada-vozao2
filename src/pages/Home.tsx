import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'parent' | 'child'>('parent');

  // Persistence Check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile to know role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role === 'parent') navigate('/parent/home');
        else if (profile?.role === 'child') navigate('/child/home');
        else navigate('/parent/home'); // fallback
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isRegistering) {
        // REGISTER
        if (!email || !password || !name) throw new Error("Preencha todos os campos.");

        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: name, role: role } }
        });
        if (error) throw error;
        toast.success("Cadastro realizado! Bem-vindo!");
        // Check if auto-login happened or need email confirmation
        if (data.user) {
          if (role === 'parent') navigate('/parent/home');
          else navigate('/child/home');
        }
      } else {
        // LOGIN
        if (!email || !password) throw new Error("Informe email e senha.");

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Redirect based on role
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
          toast.success("Bem-vindo de volta!");
          if (profile?.role === 'child') navigate('/child/home');
          else navigate('/parent/home');
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">⚽</div>
          <CardTitle className="text-4xl text-white font-display tracking-wider">Mesada do Vozão</CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            {isRegistering ? "Crie sua conta no time" : "Entre para gerenciar o jogo"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label className="text-white">Nome do Craque/Técnico</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="bg-slate-800 border-slate-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Posição (Função)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === 'parent' ? 'default' : 'outline'}
                    className={role === 'parent' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-transparent text-slate-400 border-slate-700'}
                    onClick={() => setRole('parent')}
                  >
                    Responsável
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'child' ? 'default' : 'outline'}
                    className={role === 'child' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-transparent text-slate-400 border-slate-700'}
                    onClick={() => setRole('child')}
                  >
                    Atleta
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-white">E-mail</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="bg-slate-800 border-slate-700 text-white" />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Senha</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" className="bg-slate-800 border-slate-700 text-white" />
          </div>

          <Button
            className={`w-full h-12 text-lg font-bold mt-4 ${isRegistering ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'Processando...' : (isRegistering ? 'Cadastrar e Entrar' : 'Entrar')}
          </Button>

        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="text-slate-400 hover:text-white">
            {isRegistering ? "Já tem conta? Clique aqui para Entrar." : "Não tem conta? Clique aqui para Cadastrar."}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}