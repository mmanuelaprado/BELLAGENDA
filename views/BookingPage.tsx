
import React, { useState } from 'react';
import { Professional, Service, Appointment } from '../types';
import { Icons } from '../constants';

interface BookingPageProps {
  professional: Professional;
  services: Service[];
  onComplete: (a: Omit<Appointment, 'id'>) => void;
  onHome: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ professional, services, onComplete, onHome }) => {
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

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 max-w-md w-full animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icons.Check />
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Agendamento Confirmado!</h1>
          <p className="text-gray-500 mb-8">
            Tudo certo, {clientInfo.name.split(' ')[0]}! Reservamos o seu horário para o serviço <span className="font-bold text-black">{selectedService?.name}</span>.
          </p>
          <div className="bg-gray-50 p-6 rounded-3xl text-left mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-pink-600"><Icons.Calendar /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Data e Hora</p>
                <p className="font-bold text-black">{selectedDate} às {selectedTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-pink-600"><Icons.Users /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Profissional</p>
                <p className="font-bold text-black">{professional.businessName}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onHome}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
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
             <span className="text-3xl font-bold">{professional.businessName.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-black">{professional.businessName}</h1>
          <p className="text-gray-500">Agendamento Online</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="flex h-1.5 bg-gray-100">
            <div className={`h-full bg-pink-600 transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-black mb-6">Escolha o Serviço</h2>
                <div className="space-y-4">
                  {services.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => { setSelectedService(s); setStep(2); }}
                      className={`w-full text-left p-6 rounded-3xl border transition-all flex justify-between items-center group ${
                        selectedService?.id === s.id ? 'border-pink-600 bg-pink-50' : 'border-gray-100 hover:border-pink-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-black group-hover:text-pink-600 transition-colors">{s.name}</h4>
                        <p className="text-sm text-gray-500">{s.duration} min • R$ {s.price}</p>
                      </div>
                      <div className="text-gray-300 group-hover:text-pink-600">
                        <Icons.Plus />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <button onClick={() => setStep(1)} className="text-gray-400 font-bold text-sm mb-4 flex items-center space-x-1 hover:text-black">
                  <span>&larr; Voltar</span>
                </button>
                <h2 className="text-xl font-bold text-black mb-6">Escolha Data e Hora</h2>
                
                <div className="mb-8">
                  <p className="text-sm font-bold text-gray-400 mb-3 uppercase">Datas Disponíveis</p>
                  <div className="flex space-x-3 overflow-x-auto pb-4 custom-scrollbar">
                    {dates.map(date => {
                      const d = new Date(date + 'T12:00:00');
                      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                      const dayNum = d.getDate();
                      return (
                        <button 
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            selectedDate === date ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase">{dayName}</span>
                          <span className="text-xl font-bold">{dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="animate-fade-in">
                    <p className="text-sm font-bold text-gray-400 mb-3 uppercase">Horários</p>
                    <div className="grid grid-cols-4 gap-3">
                      {times.map(time => (
                        <button 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${
                            selectedTime === time ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                  className="w-full mt-10 bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-100"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <button onClick={() => setStep(2)} className="text-gray-400 font-bold text-sm mb-4 flex items-center space-x-1 hover:text-black">
                  <span>&larr; Voltar</span>
                </button>
                <h2 className="text-xl font-bold text-black mb-6">Confirme seus Dados</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Seu Nome</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-pink-600 outline-none bg-gray-50"
                      placeholder="Como podemos te chamar?"
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Seu WhatsApp</label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-pink-600 outline-none bg-gray-50"
                      placeholder="(00) 00000-0000"
                      value={clientInfo.phone}
                      onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-6 bg-pink-50 rounded-[2rem] mb-8">
                  <h4 className="text-sm font-bold text-pink-600 uppercase mb-4 tracking-wider">Resumo do Agendamento</h4>
                  <div className="space-y-2">
                    <p className="text-black font-bold text-lg">{selectedService?.name}</p>
                    <p className="text-gray-500 text-sm">🗓️ {selectedDate} às {selectedTime}</p>
                    <p className="text-gray-500 text-sm">📍 {professional.businessName}</p>
                    <p className="text-black font-bold text-xl pt-2">R$ {selectedService?.price}</p>
                  </div>
                </div>

                <button 
                  disabled={!clientInfo.name || !clientInfo.phone}
                  onClick={handleConfirm}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-700 transition-all disabled:opacity-50 shadow-xl shadow-pink-200"
                >
                  Confirmar Agendamento
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
