
import React, { useState } from 'react';
import { Professional, Appointment, Service, View } from '../types.ts';
import { Icons } from '../constants.tsx';

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
  
  const bookingUrl = `pradoagenda.com/b/${user?.slug || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Olá, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 font-medium tracking-tight">Sua agenda premium em tempo real.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => navigate('booking')}
            className="w-full sm:w-auto bg-[#FF1493] text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl shadow-pink-100 flex items-center justify-center space-x-3"
          >
            <Icons.Eye />
            <span>Ver sua página pública</span>
          </button>
          
          <div className="flex items-center bg-white border border-gray-100 rounded-3xl p-2 pl-4 shadow-sm gap-2 w-full sm:w-auto">
            <div className="flex flex-col mr-4 overflow-hidden py-1">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Link de Agendamento</span>
              <span className="text-xs font-bold text-[#FF1493] truncate max-w-[150px]">{bookingUrl}</span>
            </div>
            <button onClick={handleCopy} className="bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
              <Icons.Copy />
              <span className="text-[10px] font-black uppercase tracking-widest px-2">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF1493] mb-4 group-hover:bg-[#FF1493] group-hover:text-white transition-all">
            <Icons.Calendar />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Atendimentos Hoje</p>
          <h3 className="text-4xl font-black text-black mt-2 tracking-tighter">
            {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
          </h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
            <Icons.Clock />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Pendentes</p>
          <h3 className="text-4xl font-black text-black mt-2 tracking-tighter">
            {appointments.filter(a => a.status === 'pending').length}
          </h3>
        </div>
        <div className="bg-[#FF1493] p-8 rounded-[2.5rem] shadow-2xl shadow-pink-200 text-white hover:scale-[1.02] transition-all cursor-pointer" onClick={() => navigate('services')}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
             <Icons.Scissors />
          </div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Serviços Ativos</p>
          <h3 className="text-4xl font-black mt-2 tracking-tighter">{services.filter(s => s.active).length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-black tracking-tight uppercase">Próximos Atendimentos</h2>
          <button onClick={() => navigate('agenda')} className="text-[10px] font-black uppercase tracking-widest text-[#FF1493] hover:underline">Ver Agenda Completa</button>
        </div>
        <div className="divide-y divide-gray-50">
          {appointments.length > 0 ? appointments.slice().reverse().map((appt) => {
            const service = services.find(s => s.id === appt.serviceId);
            return (
              <div key={appt.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-pink-100 rounded-3xl flex items-center justify-center text-[#FF1493] text-xl font-black shadow-sm">{appt.clientName.charAt(0)}</div>
                  <div>
                    <h4 className="font-black text-black text-lg tracking-tight uppercase">{appt.clientName}</h4>
                    <p className="text-pink-600 text-[10px] font-black uppercase tracking-widest">{service?.name || 'Serviço'}</p>
                    <p className="text-gray-400 text-xs font-bold tracking-wide">WhatsApp: {appt.clientPhone}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-6 lg:mt-0">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <Icons.Calendar />
                      <span className="text-sm font-black text-black">{new Date(appt.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icons.Clock />
                      <span className="text-xs font-bold text-gray-400">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>{appt.status}</span>
                </div>
              </div>
            );
          }) : (
            <div className="p-20 text-center text-gray-400 font-bold italic tracking-tight uppercase">Nenhum agendamento para mostrar</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
