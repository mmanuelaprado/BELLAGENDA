
import React, { useState } from 'react';
import { Professional, Service, View } from '../types';
import { Icons } from '../constants';
import { GoogleGenAI } from '@google/genai';

interface MarketingPageProps {
  user: Professional | null;
  services: Service[];
  onLogout: () => void;
  navigate: (v: View) => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ user, services, onLogout, navigate }) => {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [tone, setTone] = useState('elegant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generatePost = async () => {
    if (!selectedServiceId) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const service = services.find(s => s.id === selectedServiceId);
      
      const prompt = `
        Crie uma legenda de alta conversão para o Instagram para uma profissional da beleza.
        Serviço: ${service?.name}
        Descrição do serviço: ${service?.description}
        Tom de voz: ${tone === 'elegant' ? 'Elegante e Profissional' : 'Amigável e Empolgada'}
        Público: Mulheres que buscam autocuidado.
        Inclua:
        1. Gancho inicial chamativo.
        2. Benefícios do serviço.
        3. Call to action para clicar no link da bio (que é o link da BellaAgenda).
        4. Emojis estratégicos.
        Use português do Brasil.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text || "Houve um erro.");
    } catch (e) {
      setResult("Erro ao gerar conteúdo.");
    } finally {
      setIsGenerating(false);
    }
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
          <button onClick={() => navigate('services')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Scissors />
            <span>Serviços</span>
          </button>
          <button onClick={() => navigate('clients')} className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:bg-gray-900 rounded-xl font-medium transition-all">
            <Icons.Users />
            <span>Clientes</span>
          </button>
          <button onClick={() => navigate('marketing')} className="w-full flex items-center space-x-3 p-3 bg-pink-600 rounded-xl font-medium transition-all">
            <Icons.Sparkles />
            <span>Marketing AI</span>
          </button>
        </nav>
        <button onClick={onLogout} className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-colors mt-auto">
          <Icons.Logout />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-10 max-w-4xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Marketing Inteligente</h1>
          <p className="text-gray-500">Use a BellaAI para criar posts que vendem.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-black mb-6">Configurar Post</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Serviço em Destaque</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pink-600 bg-gray-50 font-medium"
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                >
                  <option value="">Selecione um serviço...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tom de Voz</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTone('elegant')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${tone === 'elegant' ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                  >
                    Elegante
                  </button>
                  <button 
                    onClick={() => setTone('friendly')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${tone === 'friendly' ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                  >
                    Amigável
                  </button>
                </div>
              </div>

              <button 
                onClick={generatePost}
                disabled={isGenerating || !selectedServiceId}
                className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-700 transition-all shadow-xl shadow-pink-100 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                ) : <Icons.Brain />}
                <span>{isGenerating ? 'BellaAI está criando...' : 'Gerar Legenda Instagram'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-black mb-6">Seu Conteúdo</h2>
            {result ? (
              <div className="animate-fade-in flex-grow flex flex-col">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex-grow">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert("Copiado!");
                  }}
                  className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Icons.Copy />
                  <span>Copiar Legenda</span>
                </button>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-pink-50 text-pink-200 rounded-full flex items-center justify-center mb-4">
                  <Icons.Sparkles />
                </div>
                <p className="text-gray-400 font-medium">Selecione um serviço ao lado para que a BellaAI gere uma legenda incrível para suas redes sociais.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-between items-center z-50 shadow-2xl rounded-t-3xl">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Calendar />
          <span className="text-[10px] font-black uppercase">Início</span>
        </button>
        <button onClick={() => navigate('services')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Scissors />
          <span className="text-[10px] font-black uppercase">Serviços</span>
        </button>
        <button onClick={() => navigate('clients')} className="flex flex-col items-center space-y-1 text-gray-300">
          <Icons.Users />
          <span className="text-[10px] font-black uppercase">Clientes</span>
        </button>
        <button onClick={() => navigate('marketing')} className="flex flex-col items-center space-y-1 text-pink-600">
          <Icons.Sparkles />
          <span className="text-[10px] font-black uppercase">AI</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center space-y-1 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="2