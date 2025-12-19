
import React, { useState } from 'react';
import { Professional, Appointment, Service, View } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  user: Professional | null;
  appointments: Appointment[];
  services: Service[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, appointments, services, onUpdateStatus, onLogout, navigate }) => {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'today' | 'all'>('today');
  
  const bookingUrl = `pradoagenda.com/b/${user?.slug || 'prado-beauty'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'dashboard' || view === 'agenda' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
      }`}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </button>
  );

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
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Olá, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-500 font-medium">Sua agenda premium em tempo real.</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-gray-100 rounded-3xl p-2 pl-4 shadow-sm gap-2">
              <div className="flex flex-col mr-4 overflow-hidden py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Link Público</span>
                </div>
                <span className="text-sm font-semibold text-[#FF1493] truncate max-w-[150px] sm:max-w-[200px]">{bookingUrl}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('booking')} className="flex-1 bg-gray-50 text-gray-700 p-3 rounded-2xl hover:bg-gray-100 border border-gray-100 transition-all flex items-center justify-center space-x-2">
                  <Icons.Eye />
                  <span className="text-xs font-bold uppercase tracking-wide">Visualizar</span>
                </button>
                <button onClick={handleCopy} className="flex-1 bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                  <Icons.Copy />
                  <span className="text-xs font-bold uppercase tracking-wide">{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF1493] mb-4">
              <Icons.Calendar />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hoje</p>
            <h3 className="text-3xl font-bold text-black mt-1">
              {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
              <Icons.Clock />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pendentes</p>
            <h3 className="text-3xl font-bold text-black mt-1">
              {appointments.filter(a => a.status === 'pending').length}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF1493] mb-4">
               <Icons.Users />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Serviços</p>
            <h3 className="text-3xl font-bold text-black mt-1">{services.filter(s => s.active).length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-black">Próximos Clientes</h2>
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
               <button onClick={() => setFilter('today')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filter === 'today' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Hoje</button>
               <button onClick={() => setFilter('all')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filter === 'all' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Todos</button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {appointments.length > 0 ? appointments.slice(0, 5).map((appt) => (
              <div key={appt.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF1493] text-xl font-bold uppercase">{appt.clientName.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-black text-lg">{appt.clientName}</h4>
                    <p className="text-gray-400 text-sm font-medium">Procedimento Estético</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 lg:mt-0 lg:gap-16">
                   <span className="text-sm font-bold text-black">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>{appt.status}</span>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-gray-400">Nenhum agendamento para mostrar.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
