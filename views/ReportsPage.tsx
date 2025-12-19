
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-black text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold">B</span></div>
          <span className="text-xl font-bold">BellaAgenda</span>
        </div>
        <nav className="flex-grow space-y-2">
          <button onClick={() => navigate('dashboard')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all"><Icons.Calendar /><span>Agenda</span></button>
          <button onClick={() => navigate('services')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all"><Icons.Scissors /><span>Serviços</span></button>
          <button onClick={() => navigate('clients')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all"><Icons.Users /><span>Clientes</span></button>
          <button onClick={() => navigate('reports')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all"><Icons.Chart /><span>Relatórios</span></button>
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-auto"><Icons.Logout /><span>Sair</span></button>
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
            <p className="text-pink-500 text-sm mt-2 font-bold">Ticket Médio: R$ {confirmed.length > 0 ? (revenue / confirmed.length).toFixed(0) : 0}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Novos Clientes</p>
            <h3 className="text-3xl font-bold text-black">8</h3>
            <div className="flex -space-x-2 mt-3">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white"></div>)}
            </div>
          </div>
          <div className="bg-pink-600 p-8 rounded-[2rem] shadow-xl shadow-pink-100 text-white">
            <p className="text-pink-200 text-xs font-bold uppercase mb-2">Lucro Projetado</p>
            <h3 className="text-3xl font-bold">R$ {(revenue * 0.85).toFixed(0)}</h3>
            <p className="text-pink-200 text-sm mt-2 italic">Estimativa pós-custos</p>
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
                    <span className="text-pink-600">R$ {stat.total}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: `${(stat.total / revenue) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400">{stat.count} atendimentos concluídos</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-50 shadow-2xl rounded-t-3xl">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-300"><Icons.Calendar /><span className="text-[10px] font-black uppercase">Início</span></button>
        <button onClick={() => navigate('reports')} className="flex flex-col items-center space-y-1 text-pink-600"><Icons.Chart /><span className="text-[10px] font-black uppercase">Vendas</span></button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center space-y-1 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span className="text-[10px] font-black uppercase">Perfil</span></button>
      </nav>
    </div>
  );
};

export default ReportsPage;
