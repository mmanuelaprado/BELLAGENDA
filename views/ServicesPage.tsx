
import React, { useState } from 'react';
import { Professional, Service, View } from '../types';
import { Icons } from '../constants';

interface ServicesPageProps {
  user: Professional | null;
  services: Service[];
  onAdd: (s: Omit<Service, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ user, services, onAdd, onToggle, onDelete, onLogout, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  });

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'services' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
      }`}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </button>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, active: true });
    setShowModal(false);
    setFormData({ name: '', description: '', duration: 30, price: 0 });
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

      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Seus Serviços</h1>
            <p className="text-gray-500">Gerencie o que você oferece aos seus clientes.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#FF1493] text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg flex items-center space-x-2"
          >
            <Icons.Plus />
            <span>Adicionar Serviço</span>
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-pink-50 p-3 rounded-2xl text-[#FF1493]">
                    <Icons.Scissors />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onDelete(service.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={service.active} onChange={() => onToggle(service.id)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1493]"></div>
                    </label>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Icons.Clock />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-black">R$ {service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-black">Novo Serviço</h2>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition-colors">✕</button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Serviço</label>
                 <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none bg-gray-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                 <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none bg-gray-50" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Duração (min)</label>
                   <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none bg-gray-50" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$)</label>
                   <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF1493] outline-none bg-gray-50" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                 </div>
               </div>
               <button className="w-full bg-[#FF1493] text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition-all shadow-lg mt-4">Criar Serviço</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
