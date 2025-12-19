
import React, { useState, useMemo } from 'react';
import { Professional, Service, Appointment, BusinessConfig } from '../types';
import { Icons } from '../constants';

interface BookingPageProps {
  professional: Professional;
  services: Service[];
  config: BusinessConfig;
  onComplete: (a: Omit<Appointment, 'id'>) => void;
  onHome: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ professional, services, config, onComplete, onHome }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    onComplete({
      serviceId: selectedService?.id || '',
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      date: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
      status: 'confirmed'
    });
    setIsSuccess(true);
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    
    const dayOfWeek = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' });
    const dayConfig = config.expediente.find(d => 
      dayOfWeek.toLowerCase().includes(d.day.toLowerCase())
    );

    if (!dayConfig || !dayConfig.active) return [];

    const slots: string[] = [];
    const interval = config.interval;

    dayConfig.shifts.forEach(shift => {
      if (!shift.active) return;
      
      let current = new Date(`2000-01-01T${shift.start}`);
      const end = new Date(`2000-01-01T${shift.end}`);

      while (current < end) {
        slots.push(current.toTimeString().slice(0, 5));
        current = new Date(current.getTime() + interval * 60000);
      }
    });

    return slots;
  }, [selectedDate, config]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 max-w-md w-full animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icons.Check />
          </div>
          <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Agendamento Confirmado!</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Tudo certo, {clientInfo.name.split(' ')[0]}! Reservamos o seu horário para o serviço <span className="font-bold text-black">{selectedService?.name}</span>.
          </p>
          <div className="bg-gray-50 p-6 rounded-3xl text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-[#FF1493]"><Icons.Calendar /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Data e Hora</p>
                <p className="font-bold text-black">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-[#FF1493]"><Icons.Users /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Profissional</p>
                <p className="font-bold text-black">{professional.businessName}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onHome}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl">
             <span className="text-3xl font-black uppercase">{professional.businessName.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">{professional.businessName}</h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-1">Agendamento Online Seguro</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex h-1.5 bg-gray-50">
            <div className={`h-full bg-[#FF1493] transition-all duration-700 ease-out`} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-black mb-6 tracking-tight">O que vamos fazer hoje?</h2>
                <div className="space-y-4">
                  {services.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => { setSelectedService(s); setStep(2); }}
                      className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex justify-between items-center group ${
                        selectedService?.id === s.id ? 'border-[#FF1493] bg-pink-50' : 'border-gray-50 hover:border-pink-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-black text-black group-hover:text-[#FF1493] transition-colors uppercase text-sm tracking-tight">{s.name}</h4>
                        <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide">{s.duration} min • R$ {s.price}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedService?.id === s.id ? 'bg-[#FF1493] text-white' : 'bg-gray-100 text-gray-300 group-hover:bg-pink-100 group-hover:text-[#FF1493]'}`}>
                        <Icons.Plus />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <button onClick={() => setStep(1)} className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center space-x-2 hover:text-black transition-colors">
                  <Icons.ArrowLeft />
                  <span>Voltar aos Serviços</span>
                </button>
                <h2 className="text-xl font-black text-black mb-6 tracking-tight">Selecione o melhor horário</h2>
                
                <div className="mb-8">
                  <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Calendário Próximos 7 Dias</p>
                  <div className="flex space-x-3 overflow-x-auto pb-4 custom-scrollbar">
                    {dates.map(date => {
                      const d = new Date(date + 'T12:00:00');
                      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                      const dayNum = d.getDate();
                      return (
                        <button 
                          key={date}
                          onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                          className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            selectedDate === date ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{dayName}</span>
                          <span className="text-xl font-black">{dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="animate-fade-in">
                    <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Janelas de {config.interval} min</p>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {availableTimes.map(time => (
                          <button 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${
                              selectedTime === time ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-2xl text-center">
                        <p className="text-gray-400 font-bold text-sm">Ops! Não há horários disponíveis para este dia. 💅</p>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                  className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
                >
                  Continuar Agendamento
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center space-x-2 hover:text-black transition-colors">
                  <Icons.ArrowLeft />
                  <span>Voltar ao Calendário</span>
                </button>
                <h2 className="text-xl font-black text-black mb-6 tracking-tight">Finalizar Reserva</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seu Nome Completo</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#FF1493] outline-none bg-gray-50 font-bold"
                      placeholder="Maria Silva"
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">WhatsApp para Lembrete</label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#FF1493] outline-none bg-gray-50 font-bold"
                      placeholder="(00) 00000-0000"
                      value={clientInfo.phone}
                      onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-6 bg-pink-50 rounded-[2rem] mb-8 border border-pink-100">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">Resumo Final</h4>
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase text-pink-500 border border-pink-100 shadow-sm">Confirmado</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-black font-black text-xl tracking-tight uppercase">{selectedService?.name}</p>
                    <p className="text-gray-600 font-bold text-sm">🗓️ {selectedDate.split('-').reverse().join('/')} às {selectedTime}</p>
                    <p className="text-[#FF1493] font-black text-2xl pt-2">R$ {selectedService?.price}</p>
                  </div>
                </div>

                <button 
                  disabled={!clientInfo.name || !clientInfo.phone}
                  onClick={handleConfirm}
                  className="w-full bg-[#FF1493] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-700 transition-all disabled:opacity-30 shadow-2xl shadow-pink-200"
                >
                  Confirmar Agendamento Agora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
