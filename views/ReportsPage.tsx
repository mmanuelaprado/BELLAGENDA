
import React from 'react';
import { Professional, Appointment, Service, View } from '../types';
import { Icons } from '../constants';

interface ReportsPageProps {
  user: Professional | null;
  appointments: Appointment[];
  services: Service[];
  onLogout: () => void;
  navigate: (v: View) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ user, appointments, services, onLogout, navigate }) => {
  const confirmed = appointments.filter(a => a.status === 'confirmed');
  const revenue = confirmed.reduce((acc, curr) => {
    const service = services.find(s => s.id === curr.serviceId);
    return acc + (service?.price || 0);
  }, 0);

  const serviceStats = services.map(s => {
    const count = confirmed.filter(a => a.serviceId === s.id).length;
    return { name: s.name, count, total: count * s.price };
  }).sort((a, b) => b.total - a.total);

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'finance' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Desempenho Financeiro</h1>
          <p className="text-gray-500">Visualize seus ganhos e serviços mais vendidos.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Faturamento Total</p>
            <h3 className="text-3xl font-bold text-black">R$ {revenue}</h3>
            <p className="text-green-500 text-sm mt-2 font-bold">+12% vs mês anterior</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Atendimentos</p>
            <h3 className="text-3xl font-bold text-black">{confirmed.length}</h3>
            <p className="text-[#FF1493] text-sm mt-2 font-bold">Ticket Médio: R$ {confirmed.length > 0 ? (revenue / confirmed.length).toFixed(0) : 0}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Novos Clientes</p>
            <h3 className="text-3xl font-bold text-black">8</h3>
            <div className="flex -space-x-2 mt-3">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white"></div>)}
            </div>
          </div>
          <div className="bg-[#FF1493] p-8 rounded-[2rem] shadow-xl shadow-pink-100 text-white">
            <p className="text-pink-100 text-xs font-bold uppercase mb-2">Lucro Projetado</p>
            <h3 className="text-3xl font-bold">R$ {(revenue * 0.85).toFixed(0)}</h3>
            <p className="text-pink-100 text-sm mt-2 italic">Estimativa pós-custos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-black mb-6">Serviços mais Rentáveis</h2>
            <div className="space-y-6">
              {serviceStats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-black">{stat.name}</span>
                    <span className="text-[#FF1493]">R$ {stat.total}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF1493] rounded-full" style={{ width: `${(stat.total / revenue) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400">{stat.count} atendimentos concluídos</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
