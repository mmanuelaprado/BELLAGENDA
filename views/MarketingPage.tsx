
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
  
  const [isImgGenerating, setIsImgGenerating] = useState(false);
  const [imgResult, setImgResult] = useState<string | null>(null);

  const generatePost = async () => {
    if (!selectedServiceId) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const service = services.find(s => s.id === selectedServiceId);
      const prompt = `Crie uma legenda de alta conversão para o Instagram para uma profissional da beleza. Serviço: ${service?.name}. Descrição: ${service?.description}. Tom: ${tone === 'elegant' ? 'Elegante' : 'Amigável'}.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setResult(response.text || "Erro ao gerar legenda.");
    } catch (e) {
      setResult("Erro ao gerar conteúdo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!selectedServiceId) return;
    setIsImgGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const service = services.find(s => s.id === selectedServiceId);
      const prompt = `A high quality, professional and aesthetically pleasing photo of a ${service?.name} service being performed in a modern beauty salon. Bright, minimalist background, pink and white color scheme. Close-up, artistic style.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setImgResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar imagem.");
    } finally {
      setIsImgGenerating(false);
    }
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button 
      onClick={() => navigate(view)} 
      className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all ${
        view === 'marketing' ? 'bg-[#FF1493] text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/5'
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

      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Marketing Inteligente</h1>
          <p className="text-gray-500">Crie posts completos com IA (Legenda + Imagem).</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-black mb-6">Configurar</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Serviço</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#FF1493] bg-gray-50 font-medium" value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tom</label>
                <div className="flex gap-2">
                  <button onClick={() => setTone('elegant')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase border transition-all ${tone === 'elegant' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}>Elegante</button>
                  <button onClick={() => setTone('friendly')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase border transition-all ${tone === 'friendly' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}>Amigável</button>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <button onClick={generatePost} disabled={isGenerating || !selectedServiceId} className="w-full bg-[#FF1493] text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : <Icons.Brain />}
                  <span>Gerar Legenda</span>
                </button>
                <button onClick={generateImage} disabled={isImgGenerating || !selectedServiceId} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  {isImgGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : <Icons.Camera />}
                  <span>Gerar Foto IA</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[300px]">
              <h2 className="text-xl font-bold text-black mb-6">Legenda Sugerida</h2>
              {result ? <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100"><pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">{result}</pre></div> : <p className="text-gray-400">Gere uma legenda para ver o resultado.</p>}
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-black mb-6">Imagem Profissional</h2>
              {imgResult ? (
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
                  <img src={imgResult} className="w-full aspect-square object-cover" alt="IA Generated" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { const link = document.createElement('a'); link.href = imgResult; link.download = 'post.png'; link.click(); }} className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-xl">Baixar Imagem</button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100">
                  <Icons.Camera />
                  <p className="mt-4 font-medium">Nenhuma imagem gerada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketingPage;
