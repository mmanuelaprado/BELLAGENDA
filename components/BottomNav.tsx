
import React from 'react';
import { Icons } from '../constants.tsx';
import { View } from '../types.ts';

interface BottomNavProps {
  activeView: View;
  navigate: (v: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, navigate }) => {
  const navItems = [
    { view: 'dashboard' as View, icon: Icons.Home, label: 'Início' },
    { view: 'agenda' as View, icon: Icons.Calendar, label: 'Agenda' },
    { view: 'clients' as View, icon: Icons.Users, label: 'Clientes' },
    { view: 'services' as View, icon: Icons.Scissors, label: 'Serviços' },
    { view: 'settings' as View, icon: Icons.Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pt-3 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" 
         style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 8px)' }}>
      {navItems.map((item) => {
        const isActive = activeView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => navigate(item.view)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${
              isActive ? 'text-[#FF1493] scale-110' : 'text-gray-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-pink-50' : ''}`}>
              <item.icon />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
