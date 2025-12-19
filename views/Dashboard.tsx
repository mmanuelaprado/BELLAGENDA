
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
  
  const bookingUrl = `${window.location.origin}/?b=${user?.slug || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* App Header Bar */}
      <div className="sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#FF1493] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-pink-200">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-black tracking-tight leading-none">Olá, {user?.name.split(' ')[0]}</h1>
            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mt-1">{user?.businessName}</p>
          </div>
        </div>
        <button onClick={() => navigate('company')} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-90 transition-transform">
          <Icons.Settings />
        </button>
      </div>

      <main className="p-6 space-y-8 pb-10">
        {/* Quick Actions Container */}
        <section className="bg-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1493] rounded-full blur-[60px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
           <h2 className="text-white text-lg font-black uppercase tracking-tight mb-4 relative z-10">Sua vitrine está pronta.</h2>
           <p className="text-gray-400 text-sm font-medium mb-8 relative z-10">Compartilhe seu link de agendamento nas redes sociais e receba reservas 24h.</p>
           
           <div className="flex flex-col gap-3 relative z-10">
             <button onClick={handleCopy} className="bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
               <Icons.Copy />
               <span>{copied ? 'Copiado!' : 'Copiar Link Público'}</span>
             </button>
             <button onClick={() => navigate('marketing')} className="bg-[#FF1493] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-pink-900/30">
               <Icons.Sparkles />
               <span>Divulgar com IA</span>
             </button>
           </div>
        </section>

        {/* Daily Stats Horizontal Scroll */}
        <section className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          <div className="flex-shrink-0 w-40 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF1493] mb-4">
              <Icons.Calendar />
            </div>
            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1">Hoje</p>
            <h3 className="text-2xl font-black text-black">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</h3>
          </div>
          <div className="flex-shrink-0 w-40 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <Icons.Users />
            </div>
            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1">Clientes</p>
            <h3 className="text-2xl font-black text-black">{clients.length}</h3>
          </div>
          <div className="flex-shrink-0 w-40 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-4">
              <Icons.Scissors />
            </div>
            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1">Serviços</p>
            <h3 className="text-2xl font-black text-black">{services.filter(s => s.active).length}</h3>
          </div>
        </section>

        {/* Appointment List with Mobile App Look */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-black uppercase tracking-widest">Próximas Clientes</h2>
            <button onClick={() => navigate('agenda')} className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">Ver tudo</button>
          </div>
          
          <div className="space-y-4">
            {appointments.length > 0 ? [...appointments].reverse().slice(0, 8).map((appt) => {
              const service = services.find(s => s.id === appt.serviceId);
              return (
                <div key={appt.id} className="bg-white p-5 rounded-[2.2rem] border border-gray-50 shadow-sm flex items-center justify-between active:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                       <span className="text-sm font-black text-black leading-none">{new Date(appt.date).getHours()}:{new Date(appt.date).getMinutes().toString().padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-black text-[13px] uppercase tracking-tight leading-none mb-1">{appt.clientName}</h4>
                      <p className="text-[#FF1493] text-[8px] font-black uppercase tracking-widest">{service?.name}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${appt.status === 'confirmed' ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-yellow-400'}`}></div>
                </div>
              );
            }) : (
              <div className="bg-white py-16 px-6 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">Agenda limpa para hoje</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
