
import React from 'react';
import { Icons } from '../constants.tsx';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="h-full w-full bg-black text-white flex flex-col relative overflow-hidden app-scroll">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF1493] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-pink-600 rounded-full blur-[100px] opacity-10"></div>
      </div>

      {/* App Launch Branding */}
      <div className="flex-grow flex flex-col items-center justify-center p-10 text-center relative z-10">
        <div className="w-24 h-24 bg-[#FF1493] rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-pink-900/40 mb-10 animate-fade-in-up">
           <span className="text-5xl font-black text-white">P</span>
        </div>
        
        <h1 className="text-4xl font-black leading-tight tracking-tighter uppercase mb-4 animate-fade-in-up">
          Sua Agenda<br/>
          <span className="text-[#FF1493]">Trabalhando</span> por Você.
        </h1>
        
        <p className="text-gray-400 font-medium text-lg mb-12 max-w-xs animate-fade-in-up">
          O sistema premium de agendamento online para profissionais da beleza.
        </p>

        <div className="w-full max-w-sm space-y-4 animate-fade-in-up">
           <button 
             onClick={onStart} 
             className="w-full bg-[#FF1493] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
           >
             Começar Gratuitamente
           </button>
           <button 
             onClick={onLogin} 
             className="w-full bg-white/5 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 active:scale-95 transition-all"
           >
             Já possuo uma conta
           </button>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="p-10 text-center relative z-10">
         <div className="inline-flex items-center space-x-2 text-gray-500 mb-2">
            <Icons.Sparkles />
            <span className="text-[10px] font-black uppercase tracking-widest">Prado Social • Tech Beauty</span>
         </div>
         <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Versão do App 1.0.0 (PWA)</p>
      </footer>
    </div>
  );
};

export default LandingPage;
