
import React, { useState } from 'react';
import { Professional, Client, View } from '../types';
import { Icons } from '../constants';

interface ClientsPageProps {
  user: Professional | null;
  clients: Client[];
  onLogout: () => void;
  navigate: (v: View) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ user, clients, onLogout, navigate }) => {
  const [search, setSearch] = useState('');

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'clients' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
      }`}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </button>
  );

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
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
          <h1 className="text-3xl font-bold text-black">Seus Clientes</h1>
          <p className="text-gray-500">Acompanhe quem confia no seu trabalho.</p>
        </header>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou WhatsApp..."
            className="w-full md:max-w-md px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#FF1493] transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contato</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Agendamentos</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Última Visita</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 text-[#FF1493] rounded-xl flex items-center justify-center font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-bold text-black">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-gray-500 font-medium">{client.phone}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                        {client.totalBookings} vezes
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-gray-400 text-sm">{new Date(client.lastVisit).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[#FF1493] font-bold text-sm hover:underline">Ver Histórico</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientsPage;
