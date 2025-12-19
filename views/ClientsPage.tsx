
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

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

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
          <button onClick={() => navigate('clients')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all">
            <Icons.Users />
            <span>Clientes</span>
          </button>
          <button onClick={() => navigate('marketing')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Sparkles />
            <span>Marketing AI</span>
          </button>
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-auto">
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
            className="w-full md:max-w-md px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-pink-600 transition-all"
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
                        <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-bold">
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
                      <button className="text-pink-600 font-bold text-sm hover:underline">Ver Histórico</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClients.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </main>

      {/* Shared Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-50 shadow-2xl rounded-t-3xl">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Calendar />
          <span className="text-[10px] font-black uppercase">Início</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Scissors />
          <span className="text-[10px] font-black uppercase">Serviços</span>
        </button>
        <button onClick={() => navigate('clients')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Users />
          <span className="text-[10px] font-black uppercase">Clientes</span>
        </button>
        <button onClick={() => navigate('marketing')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Sparkles />
          <span className="text-[10px] font-black uppercase">AI</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center space-y-1 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-black uppercase">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default ClientsPage;
