
import React, { useState, useEffect } from 'react';
import { View, Professional, Service, Appointment, Client, BusinessConfig } from './types';
import LandingPage from './views/LandingPage';
import AuthView from './views/AuthView';
import Dashboard from './views/Dashboard';
import ServicesPage from './views/ServicesPage';
import ProfilePage from './views/ProfilePage';
import BookingPage from './views/BookingPage';
import ClientsPage from './views/ClientsPage';
import ReportsPage from './views/ReportsPage';
import SettingsPage from './views/SettingsPage';
import MarketingPage from './views/MarketingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<Professional | null>(null);
  
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    interval: 30,
    expediente: [
      { day: 'Segunda', active: true, shifts: [{ start: '08:00', end: '12:00', active: true }, { start: '13:00', end: '17:00', active: true }] },
      { day: 'Terça', active: true, shifts: [{ start: '08:00', end: '12:00', active: true }, { start: '13:00', end: '17:00', active: true }] },
      { day: 'Quarta', active: true, shifts: [{ start: '08:00', end: '12:00', active: true }, { start: '13:00', end: '17:00', active: true }] },
      { day: 'Quinta', active: true, shifts: [{ start: '08:00', end: '12:00', active: true }, { start: '13:00', end: '17:00', active: true }] },
      { day: 'Sexta', active: true, shifts: [{ start: '08:00', end: '12:00', active: true }, { start: '13:00', end: '17:00', active: true }] },
      { day: 'Sábado', active: false, shifts: [{ start: '08:00', end: '12:00', active: false }, { start: '13:00', end: '17:00', active: false }] },
      { day: 'Domingo', active: false, shifts: [{ start: '08:00', end: '12:00', active: false }, { start: '13:00', end: '17:00', active: false }] },
    ]
  });

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Manicure Gel', description: 'Aplicação de unhas em gel com acabamento impecável.', duration: 60, price: 80, active: true },
    { id: '2', name: 'Pedicure Relax', description: 'Cuidado completo para os pés com hidratação profunda.', duration: 45, price: 50, active: true },
    { id: '3', name: 'Design de Sobrancelha', description: 'Design personalizado conforme visagismo facial.', duration: 30, price: 35, active: true },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '101', serviceId: '1', clientName: 'Ana Silva', clientPhone: '(11) 98765-4321', date: new Date().toISOString(), status: 'confirmed' },
    { id: '102', serviceId: '2', clientName: 'Beatriz Costa', clientPhone: '(11) 99988-7766', date: new Date(Date.now() + 3600000).toISOString(), status: 'pending' },
    { id: '103', serviceId: '1', clientName: 'Carla Dias', clientPhone: '(11) 95555-4444', date: new Date(Date.now() - 86400000).toISOString(), status: 'confirmed' },
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Ana Silva', phone: '(11) 98765-4321', totalBookings: 5, lastVisit: new Date().toISOString() },
    { id: 'c2', name: 'Beatriz Costa', phone: '(11) 99988-7766', totalBookings: 2, lastVisit: new Date().toISOString() },
    { id: 'c3', name: 'Carla Dias', phone: '(11) 95555-4444', totalBookings: 1, lastVisit: new Date(Date.now() - 86400000).toISOString() },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('prado_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: Professional) => {
    setUser(u);
    localStorage.setItem('prado_user', JSON.stringify(u));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('prado_user');
    setCurrentView('landing');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentView('signup')} onLogin={() => setCurrentView('login')} onDemo={() => setCurrentView('booking')} />;
      case 'login':
        return <AuthView type="login" onAuth={handleLogin} onToggle={() => setCurrentView('signup')} />;
      case 'signup':
        return <AuthView type="signup" onAuth={handleLogin} onToggle={() => setCurrentView('login')} />;
      case 'dashboard':
        return <Dashboard user={user} appointments={appointments} services={services} onUpdateStatus={(id, s) => setAppointments(appointments.map(a => a.id === id ? {...a, status: s} : a))} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'agenda':
        return <Dashboard user={user} appointments={appointments} services={services} onUpdateStatus={(id, s) => setAppointments(appointments.map(a => a.id === id ? {...a, status: s} : a))} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'clients':
        return <ClientsPage user={user} clients={clients} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'services':
        return <ServicesPage user={user} services={services} onAdd={(s) => setServices([...services, {...s, id: Math.random().toString()}])} onToggle={(id) => setServices(services.map(s => s.id === id ? {...s, active: !s.active} : s))} onDelete={(id) => setServices(services.filter(s => s.id !== id))} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'finance':
        return <ReportsPage user={user} appointments={appointments} services={services} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'marketing':
        return <MarketingPage user={user} services={services} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'company':
        return <ProfilePage user={user} onUpdate={(u) => {setUser(u); localStorage.setItem('prado_user', JSON.stringify(u))}} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'settings':
        return <SettingsPage user={user} config={businessConfig} onUpdateConfig={setBusinessConfig} onLogout={handleLogout} navigate={setCurrentView} />;
      case 'booking':
        return <BookingPage professional={user || { name: 'Admin Prado', businessName: 'Prado Beauty', email: '', slug: 'prado-beauty' }} services={services.filter(s => s.active)} onComplete={(a) => setAppointments([...appointments, {...a, id: Math.random().toString()}])} onHome={() => user ? setCurrentView('dashboard') : setCurrentView('landing')} />;
      default:
        return <LandingPage onStart={() => setCurrentView('signup')} onLogin={() => setCurrentView('login')} onDemo={() => setCurrentView('booking')} />;
    }
  };

  return <div className="min-h-screen bg-white">{renderView()}</div>;
};

export default App;
