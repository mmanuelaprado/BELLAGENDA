
import React, { useState } from 'react';
import { Professional, BusinessConfig, View, DayExpediente } from '../types.ts';
import { Icons } from '../constants.tsx';

interface SettingsPageProps {
  user: Professional | null;
  config: BusinessConfig;
  onUpdateConfig: (c: BusinessConfig) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, config, onUpdateConfig, onLogout, navigate }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleUpdateConfig = (newConfig: BusinessConfig) => {
    onUpdateConfig(newConfig);
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const updateDay = (dayIndex: number, data: Partial<DayExpediente>) => {
    const newExpediente = [...config.expediente];
    newExpediente[dayIndex] = { ...newExpediente[dayIndex], ...data };
    handleUpdateConfig({ ...config, expediente: newExpediente });
  };

  const updateShift = (dayIndex: number, shiftIndex: number, data: any) => {
    const newExpediente = [...config.expediente];
    const newShifts = [...newExpediente[dayIndex].shifts];
    newShifts[shiftIndex] = { ...newShifts[shiftIndex], ...data };
    newExpediente[dayIndex] = { ...newExpediente[dayIndex], shifts: newShifts as [any, any] };
    handleUpdateConfig({ ...config, expediente: newExpediente });
  };

  return (
    <main className="flex-grow p-4 md:p-10 max-w-5xl mx-auto w-full pb-24 md:pb-10">
      <button 
        onClick={() => navigate('dashboard')}
        className="flex items-center text-gray-400 hover:text-[#FF1493] mb-6 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          <Icons.ArrowLeft />
        </span>
        Voltar ao Painel
      </button>

      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">Cadastro de Expediente</h1>
          <p className="text-gray-500 font-medium tracking-tight">Configuração de funcionamento do seu estabelecimento para cada dia da semana.</p>
        </header>

        <div className="bg-pink-50 p-8 rounded-[2.5rem] border border-pink-100 mb-10 animate-fade-in relative overflow-hidden group">
          <p className="text-[#FF1493] font-black text-sm relative z-10 leading-relaxed">
            Obs: Edite o expediente como desejar. As janelas de agendamento seguem seu intervalo configurado.
          </p>
        </div>

        <div className="space-y-4">
          {config.expediente.map((day, dIdx) => (
            <div key={day.day} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center space-x-6 min-w-[200px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={day.active} 
                      onChange={(e) => updateDay(dIdx, { active: e.target.checked })} 
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-7 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1493]"></div>
                  </label>
                  <span className={`font-black text-xl uppercase tracking-tighter ${day.active ? 'text-black' : 'text-gray-200'}`}>{day.day}</span>
                </div>

                {day.active ? (
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {day.shifts.map((shift, sIdx) => (
                      <div key={sIdx} className={`flex items-center space-x-4 p-5 rounded-[2rem] border-2 transition-all ${shift.active ? 'bg-gray-50 border-gray-100' : 'bg-white border-dashed border-gray-200 opacity-40'}`}>
                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                          <input 
                            type="checkbox" 
                            checked={shift.active} 
                            onChange={(e) => updateShift(dIdx, sIdx, { active: e.target.checked })} 
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{sIdx === 0 ? 'Primeiro Turno' : 'Segundo Turno'}</span>
                          <div className={`flex items-center space-x-2 ${shift.active ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <input 
                              type="time" 
                              value={shift.start} 
                              onChange={(e) => updateShift(dIdx, sIdx, { start: e.target.value })}
                              className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-black text-black outline-none focus:ring-2 focus:ring-black shadow-sm" 
                            />
                            <span className="text-gray-300 font-black">~</span>
                            <input 
                              type="time" 
                              value={shift.end} 
                              onChange={(e) => updateShift(dIdx, sIdx, { end: e.target.value })}
                              className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-black text-black outline-none focus:ring-2 focus:ring-black shadow-sm" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center bg-gray-50/50 py-6 rounded-[2.5rem] border-4 border-dotted border-gray-200">
                    <span className="text-gray-200 text-[10px] font-black uppercase tracking-[0.4em]">Folga</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">Intervalo de Horários</h1>
          <p className="text-gray-500 font-medium tracking-tight">O tempo base entre os agendamentos disponíveis.</p>
        </header>

        <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[15, 30, 45, 60].map(val => (
                <button 
                  key={val}
                  onClick={() => handleUpdateConfig({ ...config, interval: val as any })}
                  className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center justify-center space-y-3 ${
                    config.interval === val 
                      ? 'border-[#FF1493] bg-pink-50 shadow-2xl shadow-pink-100 scale-105' 
                      : 'border-gray-50 bg-white hover:border-gray-200'
                  }`}
                >
                  <span className={`text-4xl font-black ${config.interval === val ? 'text-[#FF1493]' : 'text-black'}`}>{val}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Minutos</span>
                </button>
              ))}
           </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-12 border-t border-gray-100">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            {saveStatus === 'saving' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FF1493] border-t-transparent"></div>
            ) : saveStatus === 'saved' ? (
              <div className="text-green-600 flex items-center gap-2"><Icons.Check /><span className="text-[10px] font-black uppercase tracking-widest">Salvo com sucesso</span></div>
            ) : (
              <div className="text-gray-300 flex items-center gap-2"><Icons.Repeat /><span className="text-[10px] font-black uppercase tracking-widest">Aguardando</span></div>
            )}
          </div>
        </div>
        <button className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-3">
           <Icons.Settings />
           <span>Sincronizar</span>
        </button>
      </div>
    </main>
  );
};

export default SettingsPage;
