
import React, { useState } from 'react';
import { Professional } from '../types';

interface AuthViewProps {
  type: 'login' | 'signup';
  onAuth: (user: Professional) => void;
  onToggle: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ type, onAuth, onToggle }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform validation and API call
    onAuth({
      name: formData.name || 'Usuário',
      businessName: formData.businessName || 'Meu Negócio',
      email: formData.email,
      slug: (formData.businessName || 'meu-negocio').toLowerCase().replace(/\s+/g, '-')
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-black flex flex-col justify-center p-12 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">BellaAgenda</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Transforme sua carreira com organização digital.</h2>
          <p className="text-gray-400 text-lg">
            Economize até 5 horas por semana automatizando seus agendamentos e reduzindo faltas.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-24">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-black mb-2">
            {type === 'login' ? 'Bem-vinda de volta!' : 'Comece agora grátis'}
          </h1>
          <p className="text-gray-500 mb-8">
            {type === 'login' ? 'Acesse sua conta para gerenciar sua agenda.' : 'Crie sua conta e tenha seu link profissional em 2 minutos.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Seu Nome Completo</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Julia Fernandes"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do seu Negócio</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Julia Beauty Spa"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
              <input 
                required 
                type="email" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 focus:border-transparent outline-none transition-all"
                placeholder="seuemail@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
              <input 
                required 
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 focus:border-transparent outline-none transition-all"
                placeholder="********"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition-all shadow-lg shadow-pink-100 mt-4">
              {type === 'login' ? 'Entrar no painel' : 'Criar minha conta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={onToggle} className="text-gray-500 hover:text-pink-600 font-medium transition-colors">
              {type === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
