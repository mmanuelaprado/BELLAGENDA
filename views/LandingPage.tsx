
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onDemo }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">BellaAgenda</span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={onLogin} className="text-black font-medium hover:text-pink-600 transition-colors">Entrar</button>
          <button onClick={onStart} className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-pink-700 transition-all shadow-lg shadow-pink-200">Criar minha agenda</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-12 text-center overflow-hidden">
        <div className="max-w-4xl animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight mb-6">
            Organize seus agendamentos de forma <span className="text-pink-600">simples e profissional</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Envie seu link personalizado para seus clientes e deixe o sistema cuidar de tudo. Manicures, Lash Designers e profissionais da beleza amam a BellaAgenda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={onStart} className="w-full sm:w-auto bg-pink-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-pink-700 transition-all shadow-xl shadow-pink-200 hover:-translate-y-1">
              Criar minha agenda online
            </button>
            <button onClick={onDemo} className="w-full sm:w-auto bg-gray-100 text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-all">
              Ver demonstração do cliente
            </button>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="mt-20 relative w-full max-w-5xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[500px] bg-pink-50 rounded-[100px] -z-10 blur-3xl opacity-50"></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 transform md:rotate-1 hover:rotate-0 transition-transform duration-700">
            <div className="flex items-center space-x-2 mb-6 border-b pb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 h-6 bg-gray-100 rounded-lg w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                <div className="h-40 bg-pink-50 rounded-2xl flex flex-col items-center justify-center p-6">
                  <span className="text-pink-600 font-bold text-3xl mb-1">R$ 1.250</span>
                  <span className="text-gray-500 text-sm">Ganhos da semana</span>
                </div>
                <div className="h-40 bg-gray-50 rounded-2xl p-4">
                  <div className="w-full h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-2xl p-6 min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-pink-600 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">C</div>
                        <div>
                          <p className="font-bold text-black text-sm">Agendamento #{i}</p>
                          <p className="text-gray-500 text-xs">Hoje às 14:00</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Confirmado</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t mt-20 text-center text-gray-500">
        <p>&copy; 2024 BellaAgenda. O software premium para profissionais da beleza.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
