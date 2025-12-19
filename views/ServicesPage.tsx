
import React, { useState } from 'react';
import { Professional, Service, View } from '../types';
import { Icons } from '../constants';

interface ServicesPageProps {
  user: Professional | null;
  services: Service[];
  onAdd: (s: Omit<Service, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  navigate: (v: View) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ user, services, onAdd, onToggle, onDelete, onLogout, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, active: true });
    setShowModal(false);
    setFormData({ name: '', description: '', duration: 30, price: 0 });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-black text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold">BellaAgenda</span>
        </div>
        <nav className="flex-grow space-y-2">
          <button onClick={() => navigate('dashboard')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Calendar />
            <span>Agenda</span>
          </button>
          <button onClick={() => navigate('services')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all">
            <Icons.Scissors />
            <span>Serviços</span>
          </button>
          <button onClick={() => navigate('clients')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Users />
            <span>Clientes</span>
          </button>
          <button onClick={() => navigate('reports')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Chart />
            <span>Relatórios</span>
          </button>
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-auto">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Seus Serviços</h1>
            <p className="text-gray-500">Gerencie o que você oferece aos seus clientes.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg flex items-center space-x-2"
          >
            <Icons.Plus />
            <span>Adicionar Serviço</span>
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-pink-50 p-3 rounded-2xl text-pink-600">
                    <Icons.Scissors />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onDelete(service.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={service.active} onChange={() => onToggle(service.id)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Icons.Clock />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-black">R$ {service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Calendar />
          <span className="text-[10px] font-bold uppercase">Agenda</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Scissors />
          <span className="text-[10px] font-bold uppercase">Serviços</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center space-y-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-bold uppercase">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default ServicesPage;
