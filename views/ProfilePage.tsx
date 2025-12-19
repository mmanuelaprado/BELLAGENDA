
import React, { useState } from 'react';
import { Professional, View } from '../types';
import { Icons } from '../constants';

interface ProfilePageProps {
  user: Professional | null;
  onUpdate: (u: Professional) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout, navigate }) => {
  const [formData, setFormData] = useState<Professional>(user || {
    name: '',
    businessName: '',
    email: '',
    slug: '',
    bio: '',
    instagram: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    onUpdate(formData);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-black text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold">BellaAgenda</span>
        </div>
        <nav className="flex-grow space-y-2">
          <button onClick={() => navigate('dashboard')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Calendar />
            <span>Agenda</span>
          </button>
          <button onClick={() => navigate('services')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Scissors />
            <span>Serviços</span>
          </button>
          <button onClick={() => navigate('profile')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all">
            <Icons.Users />
            <span>Meu Perfil</span>
          </button>
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-10 max-w-3xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Configurações de Perfil</h1>
          <p className="text-gray-500">Personalize como os clientes veem seu negócio.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-600 rounded-full"></span>
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Seu Nome</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">E-mail</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-600 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-600 rounded-full"></span>
              Negócio & Link
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nome do Estabelecimento</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Bio / Descrição curta</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  placeholder="Conte um pouco sobre seu trabalho..."
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Slug do Link (URL)</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <span className="px-4 py-3 text-gray-400 bg-gray-100 border-r border-gray-200 text-sm">bella.com/b/</span>
                  <input 
                    type="text" 
                    className="flex-grow px-4 py-3 outline-none bg-transparent"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Instagram</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  placeholder="@seuinstagram"
                  value={formData.instagram}
                  onChange={e => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center space-x-2 ${
                saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-100'
              }`}
            >
              {saveStatus === 'saving' && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>
                {saveStatus === 'idle' && 'Salvar Alterações'}
                {saveStatus === 'saving' && 'Salvando...'}
                {saveStatus === 'saved' && 'Perfil Atualizado!'}
              </span>
            </button>
          </div>
        </form>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Calendar />
          <span className="text-[10px] font-bold">Agenda</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Scissors />
          <span className="text-[10px] font-bold">Serviços</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Users />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Logout />
          <span className="text-[10px] font-bold">Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfilePage;
