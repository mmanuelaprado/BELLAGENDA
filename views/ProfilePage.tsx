
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

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'company' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
      }`}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </button>
  );

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
      <aside className="hidden md:flex flex-col w-72 bg-black text-white p-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-[#FF1493] rounded-lg flex items-center justify-center font-bold">P</div>
          <span className="text-xl font-bold">Pradoagenda</span>
        </div>
        <nav className="flex-grow space-y-1">
          <SidebarItem view="dashboard" icon={Icons.Home} label="Início" />
          <SidebarItem view="agenda" icon={Icons.Calendar} label="Agenda" />
          <SidebarItem view="clients" icon={Icons.Users} label="Clientes" />
          <SidebarItem view="services" icon={Icons.Scissors} label="Serviços" />
          <SidebarItem view="marketing" icon={Icons.Sparkles} label="Marketing AI" />
          <SidebarItem view="professionals" icon={Icons.Users} label="Profissionais" />
          <SidebarItem view="finance" icon={Icons.Finance} label="Financeiro" />
          <SidebarItem view="recurring" icon={Icons.Repeat} label="Agendamento recorrente" />
          <SidebarItem view="inactivation" icon={Icons.Ban} label="Inativação de horários" />
          <SidebarItem view="company" icon={Icons.Building} label="Minha empresa" />
          <SidebarItem view="settings" icon={Icons.Settings} label="Configurações" />
          <SidebarItem view="apps" icon={Icons.Smartphone} label="Baixar Apps" />
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-8">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-10 max-w-3xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Minha Empresa</h1>
          <p className="text-gray-500">Personalize como os clientes veem seu negócio.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FF1493] rounded-full"></span>
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Seu Nome</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">E-mail</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FF1493] rounded-full"></span>
              Negócio & Link
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nome do Estabelecimento</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Bio / Descrição curta</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none"
                  placeholder="Conte um pouco sobre seu trabalho..."
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Slug do Link (URL)</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <span className="px-4 py-3 text-gray-400 bg-gray-100 border-r border-gray-200 text-sm">prado.com/b/</span>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none"
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
                saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-[#FF1493] text-white hover:bg-pink-700 shadow-pink-100'
              }`}
            >
              <span>
                {saveStatus === 'idle' && 'Salvar Alterações'}
                {saveStatus === 'saving' && 'Salvando...'}
                {saveStatus === 'saved' && 'Perfil Atualizado!'}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
