
import React, { useState } from 'react';
import { Professional, Appointment, Service, View } from '../types';
import { Icons } from '../constants';
import { GoogleGenAI } from '@google/genai';

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
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const bookingUrl = `bellaagenda.com/b/${user?.slug || 'julia-beauty'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString());
      
      const prompt = `
        Aja como uma assistente de negócios premium para profissionais da beleza chamada BellaAI.
        O profissional ${user?.name} tem ${todayAppts.length} agendamentos hoje.
        Os serviços oferecidos são: ${services.map(s => s.name).join(', ')}.
        Crie um resumo motivador de 3 a 4 frases em português sobre como ele(a) pode ter um dia incrível, 
        incluindo uma dica de marketing ou atendimento personalizada.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiResponse(response.text || "Não foi possível gerar o insight no momento.");
    } catch (error) {
      console.error(error);
      setAiResponse("Houve um erro ao consultar a BellaAI. Tente novamente mais tarde.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Serviço';

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(appt.date).toDateString() === today;
    }
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">BellaAgenda</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button onClick={() => navigate('dashboard')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all shadow-lg shadow-pink-900/20">
            <Icons.Calendar />
            <span>Agenda</span>
          </button>
          <button onClick={() => navigate('services')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-all">
            <Icons.Scissors />
            <span>Serviços</span>
          </button>
          <button onClick={() => navigate('clients')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-all">
            <Icons.Users />
            <span>Clientes</span>
          </button>
          <button onClick={() => navigate('marketing')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-all">
            <Icons.Sparkles />
            <span>Marketing AI</span>
          </button>
          <button onClick={() => navigate('profile')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Meu Perfil</span>
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-auto">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Olá, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-500 font-medium">Sua agenda premium em tempo real.</p>
          </div>
          
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-2 pl-4 shadow-sm">
            <div className="flex flex-col mr-4 overflow-hidden">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Link de Agendamento</span>
              <span className="text-sm font-semibold text-pink-600 truncate max-w-[120px] sm:max-w-none">{bookingUrl}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-2 flex-shrink-0"
            >
              <Icons.Copy />
              <span className="text-xs font-bold uppercase tracking-wide">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </header>

        {/* AI Insight Section */}
        <div className="mb-10 relative overflow-hidden bg-white border border-pink-100 rounded-[2.5rem] p-8 shadow-xl shadow-pink-50">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Icons.Sparkles />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                <Icons.Sparkles />
              </div>
              <h2 className="text-xl font-bold text-black">BellaAI <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full ml-1 uppercase">Business</span></h2>
            </div>
            
            {aiResponse ? (
              <div className="animate-fade-in">
                <p className="text-gray-700 leading-relaxed italic mb-4">"{aiResponse}"</p>
                <button 
                  onClick={() => setAiResponse(null)} 
                  className="text-pink-600 text-sm font-bold hover:underline"
                >
                  Fechar resumo
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 font-medium">Deixe a inteligência artificial analisar seu dia e dar dicas de crescimento.</p>
                <button 
                  onClick={generateAiInsight}
                  disabled={isAiLoading}
                  className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  ) : <Icons.Brain />}
                  <span>{isAiLoading ? 'Analisando...' : 'Gerar Insight do Dia'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Agenda Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-black">Próximos Clientes</h2>
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
               <button 
                 onClick={() => setFilter('today')}
                 className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filter === 'today' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 Hoje
               </button>
               <button 
                 onClick={() => setFilter('all')}
                 className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filter === 'all' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 Todos
               </button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
              <div key={appt.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 text-xl font-bold uppercase ring-4 ring-pink-50">
                    {appt.clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-lg">{appt.clientName}</h4>
                    <p className="text-gray-400 text-sm font-medium">{getServiceName(appt.serviceId)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-16">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <div className="p-2 bg-gray-100 rounded-lg"><Icons.Clock /></div>
                    <div className="text-sm font-semibold">
                      <p className="text-black">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-gray-400 text-xs">{new Date(appt.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative group/status">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        appt.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {appt.status === 'confirmed' ? 'Confirmado' : appt.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                      <div className="absolute top-full right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 scale-95 group-hover/status:opacity-100 group-hover/status:scale-100 pointer-events-none group-hover/status:pointer-events-auto transition-all z-20 p-2">
                        <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase border-b mb-1">Mudar Status</p>
                        <button onClick={() => onUpdateStatus(appt.id, 'confirmed')} className="w-full text-left px-3 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 rounded-xl transition-colors">Confirmar</button>
                        <button onClick={() => onUpdateStatus(appt.id, 'cancelled')} className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6">
                  <Icons.Calendar />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">Nenhum agendamento</h3>
                <p className="text-gray-400 font-medium max-w-xs mx-auto">Sua agenda está vazia para este período. Que tal enviar seu link para os clientes?</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-50 shadow-2xl rounded-t-3xl">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Calendar />
          <span className="text-[10px] font-black uppercase">Início</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Scissors />
          <span className="text-[10px] font-black uppercase">Serviços</span>
        </button>
        <button onClick={() => navigate('clients')} className="flex flex-col items-center space-y-1 text-gray-300">
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

export default Dashboard;
