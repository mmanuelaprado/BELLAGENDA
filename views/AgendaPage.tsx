
import React, { useState } from 'react';
import { Professional, Appointment, Service, View } from '../types.ts';
import { Icons } from '../constants.tsx';

interface AgendaPageProps {
  user: Professional | null;
  appointments: Appointment[];
  services: Service[];
  onLogout: () => void;
  navigate: (v: View) => void;
}

const AgendaPage: React.FC<AgendaPageProps> = ({ user, appointments, services, onLogout, navigate }) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [viewDate, setViewDate] = useState(new Date());

  const dailyAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    const dateStr = `${apptDate.getFullYear()}-${String(apptDate.getMonth() + 1).padStart(2, '0')}-${String(apptDate.getDate()).padStart(2, '0')}`;
    return dateStr === selectedDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long' });
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const isSelected = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const onSelectDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  return (
    <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">Sua Agenda</h1>
        <p className="text-gray-500 font-medium tracking-tight">Gerencie seus compromissos e horários de forma profissional.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-black uppercase tracking-tight capitalize">
                {monthName} <span className="text-gray-300 ml-1">{currentYear}</span>
              </h2>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><Icons.ArrowLeft /></button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors rotate-180"><Icons.ArrowLeft /></button>
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
                        isSelected(day) ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-200 scale-110 z-10' : 
                        isToday(day) ? 'bg-pink-50 text-[#FF1493]' : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ) : <div className="w-full h-full"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-3"><Icons.Clock /> Atendimentos</h2>
            <button onClick={() => navigate('booking')} className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all">Novo Agendamento</button>
          </div>
          {dailyAppointments.length > 0 ? dailyAppointments.map((appt) => {
            const service = services.find(s => s.id === appt.serviceId);
            return (
              <div key={appt.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between group">
                <div className="flex items-center space-x-6">
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-black text-black leading-none">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Horário</p>
                  </div>
                  <div className="h-12 w-px bg-gray-100 hidden sm:block"></div>
                  <div>
                    <h4 className="font-black text-black text-lg uppercase group-hover:text-[#FF1493] transition-colors">{appt.clientName}</h4>
                    <p className="text-pink-600 text-[10px] font-black uppercase tracking-widest">{service?.name || 'Serviço'}</p>
                  </div>
                </div>
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>{appt.status}</div>
              </div>
            );
          }) : (
            <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Sem agendamentos para este dia.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AgendaPage;
