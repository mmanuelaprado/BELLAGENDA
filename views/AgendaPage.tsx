
import React, { useState } from 'react';
import { Professional, Appointment, Service, View } from '../types.ts';
import { Icons } from '../constants.tsx';
import Sidebar from '../Sidebar.tsx';

interface AgendaPageProps {
  user: Professional | null;
  appointments: Appointment[];
  services: Service[];
  onLogout: () => void;
  navigate: (v: View) => void;
}

const AgendaPage: React.FC<AgendaPageProps> = ({ user, appointments, services, onLogout, navigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewDate, setViewDate] = useState(new Date()); // Data para controlar qual mês está sendo exibido

  const dailyAppointments = appointments.filter(a => 
    new Date(a.date).toISOString().split('T')[0] === selectedDate
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Lógica do Calendário Mensal
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long' });
  
  const calendarDays = [];
  // Espaços vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isSelected = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    return d.toISOString().split('T')[0] === selectedDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const onSelectDay = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeView="agenda" navigate={navigate} onLogout={onLogout} />

      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Sua Agenda</h1>
          <p className="text-gray-500 font-medium tracking-tight">Gerencie seus compromissos e horários de forma profissional.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lado Esquerdo: Calendário Completo */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-black uppercase tracking-tight capitalize">
                  {monthName} <span className="text-gray-300 ml-1">{currentYear}</span>
                </h2>
                <div className="flex space-x-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <Icons.ArrowLeft />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors rotate-180">
                    <Icons.ArrowLeft />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => (
                  <div key={idx} className="aspect-square flex items-center justify-center">
                    {day ? (
                      <button
                        onClick={() => onSelectDay(day)}
                        className={`w-full h-full rounded-2xl font-black text-sm transition-all flex flex-col items-center justify-center relative ${
                          isSelected(day)
                            ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-200 scale-110 z-10'
                            : isToday(day)
                            ? 'bg-pink-50 text-[#FF1493]'
                            : 'text-black hover:bg-gray-50'
                        }`}
                      >
                        {day}
                        {appointments.some(a => new Date(a.date).toISOString().split('T')[0] === new Date(currentYear, currentMonth, day).toISOString().split('T')[0]) && !isSelected(day) && (
                          <span className="absolute bottom-1.5 w-1 h-1 bg-[#FF1493] rounded-full"></span>
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                 <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-[#FF1493]"></div>
                    <span>Data Selecionada: {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Listagem de Horários */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                <Icons.Clock />
                Atendimentos Programados
              </h2>
              <button onClick={() => navigate('booking')} className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2">
                <Icons.Plus />
                Agendar Manual
              </button>
            </div>
            
            {dailyAppointments.length > 0 ? dailyAppointments.map((appt) => {
              const service = services.find(s => s.id === appt.serviceId);
              return (
                <div key={appt.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between hover:shadow-xl transition-all group">
                  <div className="flex items-center space-x-6 w-full sm:w-auto">
                    <div className="text-center min-w-[80px]">
                      <p className="text-2xl font-black text-black leading-none">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Horário</p>
                    </div>
                    <div className="h-12 w-px bg-gray-100 hidden sm:block"></div>
                    <div>
                      <h4 className="font-black text-black text-lg tracking-tight uppercase group-hover:text-[#FF1493] transition-colors">{appt.clientName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-pink-50 text-[#FF1493] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          {service?.name || 'Serviço'}
                        </span>
                        <span className="text-gray-400 text-xs font-bold">({service?.duration} min)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-6 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right mr-4">
                      <p className="text-sm font-black text-black uppercase">R$ {service?.price || 0}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</p>
                    </div>
                    <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                    }`}>
                      {appt.status}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100 animate-fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <Icons.Calendar />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2">Sem agendamentos para este dia.</p>
                <p className="text-gray-300 text-xs font-medium italic">Sua agenda está livre para novos clientes! ✨</p>
              </div>
            )}

            {dailyAppointments.length > 0 && (
              <div className="bg-black text-white p-10 rounded-[3rem] mt-8 shadow-2xl animate-fade-in flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest mb-1">Resumo Financeiro</h3>
                  <p className="text-gray-400 text-xs font-bold">Total previsto para o dia selecionado</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-[#FF1493] tracking-tighter">
                    R$ {dailyAppointments.reduce((acc, curr) => acc + (services.find(s => s.id === curr.serviceId)?.price || 0), 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgendaPage;
