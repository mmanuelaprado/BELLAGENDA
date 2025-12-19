
import React from 'react';
import { Professional, Appointment, Service, View } from '../types.ts';
import { Icons } from '../constants.tsx';
import Sidebar from '../Sidebar.tsx';

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
      <Sidebar activeView="finance" navigate={navigate} onLogout={onLogout} />

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
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Desempenho Financeiro</h1>
          <p className="text-gray-500 font-medium tracking-tight">Visualize seus ganhos e serviços mais vendidos em tempo real.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Faturamento Total</p>
            <h3 className="text-3xl font-black text-black tracking-tighter">R$ {revenue}</h3>
            <p className="text-green-500 text-[10px] mt-3 font-black uppercase tracking-widest">+12% vs Mês Anterior</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Atendimentos</p>
            <h3 className="text-3xl font-black text-black tracking-tighter">{confirmed.length}</h3>
            <p className="text-[#FF1493] text-[10px] mt-3 font-black uppercase tracking-widest">Média: R$ {confirmed.length > 0 ? (revenue / confirmed.length).toFixed(0) : 0}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Novos Clientes</p>
            <h3 className="text-3xl font-black text-black tracking-tighter">8</h3>
            <div className="flex -space-x-2 mt-4">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white"></div>)}
            </div>
          </div>
          <div className="bg-[#FF1493] p-8 rounded-[2.5rem] shadow-2xl shadow-pink-200 text-white">
            <p className="text-pink-100 text-[10px] font-black uppercase tracking-widest mb-3">Lucro Estimado</p>
            <h3 className="text-3xl font-black tracking-tighter">R$ {(revenue * 0.85).toFixed(0)}</h3>
            <p className="text-pink-100/60 text-[10px] mt-3 font-black uppercase tracking-widest">Cálculo de 85% Líquido</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-black mb-8 uppercase tracking-tight">Serviços mais Rentáveis</h2>
            <div className="space-y-8">
              {serviceStats.map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center font-black uppercase tracking-tight">
                    <span className="text-black text-sm">{stat.name}</span>
                    <span className="text-[#FF1493]">R$ {stat.total}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF1493] rounded-full transition-all duration-1000" style={{ width: `${revenue > 0 ? (stat.total / revenue) * 100 : 0}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    <span>{stat.count} Atendimentos</span>
                    <span>{revenue > 0 ? ((stat.total / revenue) * 100).toFixed(0) : 0}% do Total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center text-center">
             <div className="w-20 h-20 bg-[#FF1493] rounded-3xl flex items-center justify-center text-white mx-auto mb-6">
               <Icons.Chart />
             </div>
             <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Visão Detalhada</h2>
             <p className="text-gray-400 font-medium text-sm px-6">
               Em breve: Relatórios de ROI, CAC e fidelização de clientes com inteligência artificial para otimizar seus lucros.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
