import React, { useState } from 'react';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'laesclinic@gmail.com' && password === 'laesclinic124') {
      localStorage.setItem('adminToken', 'true');
      toast.success('Login realizado com sucesso!');
      window.location.reload();
    } else {
      toast.error('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-script text-primary mb-2">LAES Clinic</h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Acesso Restrito
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-primary py-6 text-sm font-semibold text-white transition-all hover:bg-gold hover:text-primary"
          >
            Entrar no Painel
          </Button>
        </form>
      </div>
    </div>
  );
}
