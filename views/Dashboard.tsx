
import React, { useState } from 'react';
import { Professional, Appointment, Service, Client, View } from '../types.ts';
import { Icons } from '../constants.tsx';

interface DashboardProps {
  user: Professional | null;
  appointments: Appointment[];
  services: Service[];
  clients: Client[];
  onSaveClient: (name: string, phone: string, date: string) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, appointments, services, clients, onSaveClient, onUpdateStatus, onLogout, navigate }) => {
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  
  const bookingUrl = `${window.location.origin}/?b=${user?.slug || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCRMAction = (appt: Appointment) => {
    onSaveClient(appt.clientName, appt.clientPhone, appt.date);
    setJustSaved(appt.id);
    setTimeout(() => setJustSaved(null), 2000);
  };

  return (
    <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-4 md:pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight uppercase">Olá, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Sua agenda premium</p>
          </div>
          <div className="md:hidden w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
            {user?.name.charAt(0)}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center bg-white border border-gray-100 rounded-3xl p-1.5 pl-4 shadow-sm gap-2 w-full sm:w-auto">
            <div className="flex flex-col mr-2 overflow-hidden py-1">
              <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Link Público</span>
              <span className="text-[10px] font-bold text-[#FF1493] truncate max-w-[120px]">{bookingUrl}</span>
            </div>
            <button onClick={handleCopy} className="bg-[#FF1493] text-white p-2.5 rounded-2xl hover:bg-pink-700 transition-all flex items-center justify-center">
              <Icons.Copy />
              <span className="text-[9px] font-black uppercase tracking-widest ml-2 pr-1">{copied ? 'Ok!' : 'Link'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid - Vertical scrollable list in mobile for better thumb reach or tight 2-cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 group">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF1493] mb-3">
            <Icons.Calendar />
          </div>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Atendimentos</p>
          <h3 className="text-2xl font-black text-black mt-1 tracking-tighter">
            {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
          </h3>
        </div>
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 group">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3">
            <Icons.Users />
          </div>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Clientes</p>
          <h3 className="text-2xl font-black text-black mt-1 tracking-tighter">{clients.length}</h3>
        </div>
        <div className="col-span-2 md:col-span-1 bg-[#FF1493] p-5 md:p-8 rounded-[2rem] shadow-xl shadow-pink-100 text-white flex items-center justify-between md:flex-col md:items-start" onClick={() => navigate('services')}>
          <div>
            <p className="text-white/60 text-[8px] font-black uppercase tracking-widest">Serviços Ativos</p>
            <h3 className="text-2xl font-black mt-1 tracking-tighter">{services.filter(s => s.active).length}</h3>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center md:mt-4">
             <Icons.Scissors />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-black text-black tracking-tight uppercase">Próximos Horários</h2>
          <button onClick={() => navigate('agenda')} className="text-[9px] font-black uppercase tracking-widest text-[#FF1493]">Ver Todos</button>
        </div>
        <div className="divide-y divide-gray-50">
          {appointments.length > 0 ? [...appointments].reverse().slice(0, 5).map((appt) => {
            const service = services.find(s => s.id === appt.serviceId);
            const isInCRM = clients.some(c => c.phone === appt.clientPhone);

            return (
              <div key={appt.id} className="p-5 flex flex-col space-y-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-[#FF1493] text-lg font-black">{appt.clientName.charAt(0)}</div>
                    <div>
                      <h4 className="font-black text-black text-sm tracking-tight uppercase">{appt.clientName}</h4>
                      <p className="text-pink-600 text-[9px] font-black uppercase tracking-widest">{service?.name || 'Serviço'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-black">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{new Date(appt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400 font-bold">{appt.clientPhone}</span>
                    {!isInCRM && (
                      <button 
                        onClick={() => handleCRMAction(appt)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                          justSaved === appt.id ? 'bg-green-500 text-white' : 'bg-pink-50 text-[#FF1493]'
                        }`}
                      >
                        <Icons.UserPlus />
                        <span>{justSaved === appt.id ? 'Salvo!' : 'CRM'}</span>
                      </button>
                    )}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            );
          }) : (
            <div className="p-16 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">Nenhum agendamento</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
