import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Mail, ShieldCheck, Lock, UserCircle, Briefcase, Download, Smartphone } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Para instalar no iPhone:\n1. Clique no ícone de Compartilhar no Safari\n2. Role e clique em 'Adicionar à Tela de Início'.\n\nNo Android, verifique o menu do Chrome.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const ADMIN_PASSWORD_SIMULATION = "fire2025";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, preencha seu e-mail.');
      return;
    }

    if (loginMode === 'student') {
      if (!name) {
        setError('Por favor, preencha seu nome.');
        return;
      }
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'student'
      });
    } else {
      if (password !== ADMIN_PASSWORD_SIMULATION) {
        setError('Senha de administrador incorreta.');
        return;
      }
      onLogin({
        id: 'admin-id',
        name: 'Administrador Fire',
        email,
        role: 'admin'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-gray-50 p-8 text-center flex flex-col items-center border-b border-gray-100">
          <div className="w-24 h-24 mb-4 logo-container animate-fire">
            <img 
              src="https://r.jina.ai/i/6efbc6607e3848b598d197609f1875f5" 
              alt="Instituto Fire Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">INSTITUTO <span className="text-orange-600">FIRE</span></h1>
          
          <div className="mt-6 flex bg-gray-200 p-1 rounded-xl w-full">
            <button 
              onClick={() => { setLoginMode('student'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${loginMode === 'student' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UserCircle className="w-4 h-4" />
              <span>SOU ALUNO</span>
            </button>
            <button 
              onClick={() => { setLoginMode('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${loginMode === 'admin' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>SOU ADMIN</span>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-bold animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loginMode === 'student' && (
              <div className="animate-in slide-in-from-left-4 duration-300">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Seu Nome</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-orange-500 outline-none transition-all font-medium text-gray-700"
                    placeholder="Como quer ser chamado?"
                  />
                  <ShieldCheck className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            <div className="animate-in slide-in-from-right-4 duration-300">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">E-mail ou Gmail</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-orange-500 outline-none transition-all font-medium text-gray-700"
                  placeholder="exemplo@gmail.com"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {loginMode === 'admin' && (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Senha Admin</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-orange-500 outline-none transition-all font-medium text-gray-700"
                    placeholder="Senha de acesso"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 px-4 orange-gradient text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-orange-200 active:scale-95 uppercase tracking-wider mt-4"
          >
            {loginMode === 'student' ? 'Iniciar Aulas' : 'Painel de Gestão'}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-4">
        <button 
          onClick={handleInstallClick}
          className="flex items-center space-x-2 text-white bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-full font-bold shadow-xl transition-all border border-orange-500 group animate-bounce"
        >
          <Smartphone className="w-5 h-5" />
          <span>Baixar Aplicativo</span>
        </button>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Instituto Fire • Versão 1.0.0</p>
      </div>
    </div>
  );
};

export default Login;