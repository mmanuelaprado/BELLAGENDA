
import React, { useState } from 'react';
import { Professional, Client, View } from '../types.ts';
import { Icons } from '../constants.tsx';

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
    <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
      <button 
        onClick={() => navigate('dashboard')}
        className="flex items-center text-gray-400 hover:text-[#FF1493] mb-6 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          <Icons.ArrowLeft />
        </span>
        Voltar ao Painel
      </button>

      <header className="mb-8">
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">Seus Clientes</h1>
        <p className="text-gray-500 font-medium tracking-tight">Acompanhe quem confia no seu trabalho.</p>
      </header>

      <div className="mb-8">
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou WhatsApp..."
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#FF1493] transition-all font-bold text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Agendamentos</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Última Visita</th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.length > 0 ? filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-pink-50 text-[#FF1493] rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-[#FF1493] group-hover:text-white transition-all">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-black text-black uppercase tracking-tight">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-gray-500 font-bold text-sm">{client.phone}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      {client.totalBookings} Visitas
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="text-[#FF1493] font-black text-[10px] uppercase tracking-widest hover:underline decoration-2">Ver Histórico</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest italic text-sm">Nenhum cliente encontrado 🔎</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ClientsPage;
