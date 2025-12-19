
import React from 'react';
import { Professional, BusinessConfig, View, DayExpediente } from '../types';
import { Icons } from '../constants';

interface SettingsPageProps {
  user: Professional | null;
  config: BusinessConfig;
  onUpdateConfig: (c: BusinessConfig) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, config, onUpdateConfig, onLogout, navigate }) => {
  
  const updateDay = (dayIndex: number, data: Partial<DayExpediente>) => {
    const newExpediente = [...config.expediente];
    newExpediente[dayIndex] = { ...newExpediente[dayIndex], ...data };
    onUpdateConfig({ ...config, expediente: newExpediente });
  };

  const updateShift = (dayIndex: number, shiftIndex: number, data: any) => {
    const newExpediente = [...config.expediente];
    const newShifts = [...newExpediente[dayIndex].shifts];
    newShifts[shiftIndex] = { ...newShifts[shiftIndex], ...data };
    newExpediente[dayIndex] = { ...newExpediente[dayIndex], shifts: newShifts as any };
    onUpdateConfig({ ...config, expediente: newExpediente });
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'settings' ? 'bg-[#FF1493] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
      }`}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-72 bg-black text-white p-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-[#FF1493] rounded-lg flex items-center justify-center font-bold">P</div>
          <span className="text-xl font-bold">Pradoagenda</span>
        </div>
        <nav className="flex-grow space-y-1">
          <SidebarItem view="dashboard" icon={Icons.Home} label="Início" />
          <SidebarItem view="agenda" icon={Icons.Calendar} label="Agenda" />
          <SidebarItem view="clients" icon={Icons.Users} label="Clientes" />
          <SidebarItem view="services" icon={Icons.Scissors} label="Serviços" />
          <SidebarItem view="marketing" icon={Icons.Sparkles} label="Marketing AI" />
          <SidebarItem view="professionals" icon={Icons.Users} label="Profissionais" />
          <SidebarItem view="finance" icon={Icons.Finance} label="Financeiro" />
          <SidebarItem view="recurring" icon={Icons.Repeat} label="Agendamento recorrente" />
          <SidebarItem view="inactivation" icon={Icons.Ban} label="Inativação de horários" />
          <SidebarItem view="company" icon={Icons.Building} label="Minha empresa" />
          <SidebarItem view="settings" icon={Icons.Settings} label="Configurações" />
          <SidebarItem view="apps" icon={Icons.Smartphone} label="Baixar Apps" />
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-8">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-10 max-w-5xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-black">Cadastro de Expediente</h1>
          <p className="text-gray-500 mt-2">Configuração de funcionamento do seu estabelecimento para cada dia da semana, com dois turnos disponíveis para personalização.</p>
          <div className="bg-pink-50 border-l-4 border-[#FF1493] p-4 mt-6 rounded-r-xl">
             <p className="text-sm text-pink-700 font-medium">Obs: O expediente já virá preenchido de segunda à sexta, das 08:00 às 12:00 (primeiro turno) e das 13:00 às 17:00 (segundo turno). Edite como desejar 😁</p>
          </div>
        </header>

        <section className="space-y-4 mb-12">
          {config.expediente.map((day, idx) => (
            <div key={day.day} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center space-x-4 min-w-[140px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={day.active} onChange={e => updateDay(idx, { active: e.target.checked })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1493]"></div>
                </label>
                <span className={`font-bold uppercase text-xs tracking-widest ${day.active ? 'text-black' : 'text-gray-300'}`}>{day.day}</span>
              </div>

              {day.active ? (
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1].map(shiftIdx => (
                    <div key={shiftIdx} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <input 
                        type="checkbox" 
                        checked={day.shifts[shiftIdx].active} 
                        onChange={e => updateShift(idx, shiftIdx, { active: e.target.checked })}
                        className="w-4 h-4 text-[#FF1493] rounded focus:ring-[#FF1493]"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase mr-2">{shiftIdx === 0 ? 'Turno 1' : 'Turno 2'}</span>
                      <input 
                        type="time" 
                        disabled={!day.shifts[shiftIdx].active}
                        value={day.shifts[shiftIdx].start}
                        onChange={e => updateShift(idx, shiftIdx, { start: e.target.value })}
                        className="bg-transparent border-none text-xs font-bold outline-none disabled:opacity-30" 
                      />
                      <span className="text-gray-300">às</span>
                      <input 
                        type="time" 
                        disabled={!day.shifts[shiftIdx].active}
                        value={day.shifts[shiftIdx].end}
                        onChange={e => updateShift(idx, shiftIdx, { end: e.target.value })}
                        className="bg-transparent border-none text-xs font-bold outline-none disabled:opacity-30" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-grow py-3 px-6 bg-gray-100/50 rounded-2xl border border-dashed border-gray-200">
                  <span className="text-gray-400 text-xs font-medium italic">Estabelecimento fechado neste dia</span>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-black mb-2">Intervalo de Horários</h2>
          <p className="text-gray-500 text-sm mb-6">Os intervalos serão integrados ao horário de expediente para criar as janelas de agendamento para o seu negócio.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[15, 30, 45, 60].map(val => (
              <button 
                key={val}
                onClick={() => onUpdateConfig({ ...config, interval: val as any })}
                className={`py-4 rounded-2xl font-bold transition-all border ${
                  config.interval === val ? 'bg-[#FF1493] text-white border-[#FF1493] shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200'
                }`}
              >
                {val} min
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <p className="text-xs text-gray-500 leading-relaxed">
               <span className="font-bold text-black">Dica:</span> Por exemplo, se você selecionar intervalos de 60 minutos, as janelas de agendamento serão configuradas de 1 em 1 hora, sempre respeitando os horários de expediente.
             </p>
          </div>
        </section>

        <div className="flex justify-end mt-10">
          <button className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 shadow-xl transition-all">Salvar Configurações</button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
