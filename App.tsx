
import React, { useState, useEffect } from 'react';
import { View, Professional, Service, Appointment, Client } from './types';
import LandingPage from './views/LandingPage';
import AuthView from './views/AuthView';
import Dashboard from './views/Dashboard';
import ServicesPage from './views/ServicesPage';
import ProfilePage from './views/ProfilePage';
import BookingPage from './views/BookingPage';
import ClientsPage from './views/ClientsPage';
import MarketingPage from './views/MarketingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<Professional | null>(null);
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Manicure Gel', description: 'Aplicação de unhas em gel com acabamento impecável.', duration: 60, price: 80, active: true },
    { id: '2', name: 'Pedicure Relax', description: 'Cuidado completo para os pés com hidratação profunda.', duration: 45, price: 50, active: true },
    { id: '3', name: 'Design de Sobrancelha', description: 'Design personalizado conforme visagismo facial.', duration: 30, price: 35, active: true },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '101', serviceId: '1', clientName: 'Ana Silva', clientPhone: '(11) 98765-4321', date: new Date().toISOString(), status: 'confirmed' },
    { id: '102', serviceId: '2', clientName: 'Beatriz Costa', clientPhone: '(11) 99988-7766', date: new Date(Date.now() + 3600000).toISOString(), status: 'pending' },
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Ana Silva', phone: '(11) 98765-4321', totalBookings: 5, lastVisit: new Date().toISOString() },
    { id: 'c2', name: 'Beatriz Costa', phone: '(11) 99988-7766', totalBookings: 2, lastVisit: new Date().toISOString() },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('bella_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: Professional) => {
    setUser(u);
    localStorage.setItem('bella_user', JSON.stringify(u));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bella_user');
    setCurrentView('landing');
  };

  const addService = (s: Omit<Service, 'id'>) => {
    const newService = { ...s, id: Math.random().toString(36).substr(2, 9) };
    setServices([...services, newService]);
  };

  const toggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    const newAppt = { ...a, id: Math.random().toString(36).substr(2, 9) };
    setAppointments([newAppt, ...appointments]);
    
    // Update or add client
    setClients(prev => {
      const existing = prev.find(c => c.phone === a.clientPhone);
      if (existing) {
        return prev.map(c => c.id === existing.id ? { ...c, totalBookings: c.totalBookings + 1, lastVisit: a.date } : c);
      }
      return [...prev, { id: Math.random().toString(36).substr(2, 9), name: a.clientName, phone: a.clientPhone, totalBookings: 1, lastVisit: a.date }];
    });
  };

  const updateProfile = (updatedUser: Professional) => {
    setUser(updatedUser);
    localStorage.setItem('bella_user', JSON.stringify(updatedUser));
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentView('signup')} onLogin={() => setCurrentView('login')} />;
      case 'login':
        return <AuthView type="login" onAuth={handleLogin} onToggle={() => setCurrentView('signup')} />;
      case 'signup':
        return <AuthView type="signup" onAuth={handleLogin} onToggle={() => setCurrentView('login')} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            appointments={appointments} 
            services={services}
            onUpdateStatus={updateAppointmentStatus}
            onLogout={handleLogout} 
            navigate={setCurrentView} 
          />
        );
      case 'services':
        return (
          <ServicesPage 
            user={user}
            services={services} 
            onAdd={addService} 
            onToggle={toggleService} 
            onDelete={deleteService}
            onLogout={handleLogout}
            navigate={setCurrentView}
          />
        );
      case 'clients':
        return (
          <ClientsPage 
            user={user}
            clients={clients}
            onLogout={handleLogout}
            navigate={setCurrentView}
          />
        );
      case 'marketing':
        return (
          <MarketingPage 
            user={user}
            services={services}
            onLogout={handleLogout}
            navigate={setCurrentView}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            user={user}
            onUpdate={updateProfile}
            onLogout={handleLogout}
            navigate={setCurrentView}
          />
        );
      case 'booking':
        return (
          <BookingPage 
            professional={user || { name: 'Dra. Julia', businessName: 'Julia Beauty', email: '', slug: 'julia-beauty' }} 
            services={services.filter(s => s.active)} 
            onComplete={addAppointment} 
            onHome={() => setCurrentView('landing')} 
          />
        );
      default:
        return <LandingPage onStart={() => setCurrentView('signup')} onLogin={() => setCurrentView('login')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderView()}
    </div>
  );
};

export default App;
