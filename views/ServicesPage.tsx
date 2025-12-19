
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
      {/* Shared Sidebar Component simplified here */}
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
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-black mb-6">Novo Serviço</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Serviço</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  placeholder="Ex: Manicure Gel"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                  placeholder="Descreva brevemente o serviço..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duração (min)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-600 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-4 bg-pink-600 rounded-2xl font-bold text-white hover:bg-pink-700 transition-all shadow-lg shadow-pink-100">Salvar Serviço</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Mobile Navigation Component simplified here */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Calendar />
          <span className="text-[10px] font-bold">Agenda</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Scissors />
          <span className="text-[10px] font-bold">Serviços</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center space-y-1 text-gray-400">
          <Icons.Logout />
          <span className="text-[10px] font-bold">Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default ServicesPage;
