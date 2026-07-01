'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [server, setServer] = useState('RU1');
  const [activeTab, setActiveTab] = useState('mansions');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Добавлена вкладка DMV Камеры
  const tabs = [
    { id: 'mansions', name: 'Особняки' },
    { id: 'multipurpose', name: 'ПСН' },
    { id: 'dmv-cameras', name: 'DMV Камеры' },
    { id: 'captures', name: 'Капты' },
    { id: 'family-wars', name: 'Войны семей' },
    { id: 'arena', name: 'Арена' },
    { id: 'rating-organizations', name: 'Рейтинг фракций' },
  ];

  // Массив серверов с правильными названиями
  const servers = [
    { id: 'RU1', name: 'New York (RU1)' },
    { id: 'RU2', name: 'Detroit (RU2)' },
    { id: 'RU3', name: 'Chicago (RU3)' },
    { id: 'RU4', name: 'San Francisco (RU4)' },
    { id: 'RU5', name: 'Atlanta (RU5)' },
    { id: 'RU6', name: 'San Diego (RU6)' },
    { id: 'RU7', name: 'Los Angeles (RU7)' },
    { id: 'RU8', name: 'Miami (RU8)' },
    { id: 'RU9', name: 'Las Vegas (RU9)' },
    { id: 'RU10', name: 'Washington (RU10)' },
    { id: 'RU11', name: 'Dallas (RU11)' },
    { id: 'RU12', name: 'Boston (RU12)' },
    { id: 'RU13', name: 'Houston (RU13)' },
    { id: 'RU14', name: 'Seattle (RU14)' },
    { id: 'RU15', name: 'Phoenix (RU15)' },
    { id: 'RU16', name: 'Denver (RU16)' },
    { id: 'RU17', name: 'Portland (RU17)' },
    { id: 'RU18', name: 'Orlando (RU18)' },
    { id: 'RU19', name: 'Memphis (RU19)' }
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/majestic?endpoint=${activeTab}/${server}`);
        const result = await res.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [server, activeTab]);

  // Находим красивое название для заголовка
  const currentServerName = servers.find(s => s.id === server)?.name;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-magenta-500 selection:text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h1 className="text-xl font-bold tracking-wider text-white uppercase">Majestic Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Сервер:</span>
          <select 
            value={server} 
            onChange={(e) => setServer(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {servers.map(srv => (
              <option key={srv.id} value={srv.id}>{srv.name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.name} <span className="text-emerald-500 text-lg">[{currentServerName}]</span>
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 animate-pulse">Синхронизация данных через Vercel Edge Cache...</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 text-red-200 text-sm">
                <div className="font-semibold text-base mb-1">⚠️ Ошибка получения данных</div>
                <div className="bg-black/30 p-2.5 rounded font-mono text-xs text-red-400 break-all">
                  {error}
                </div>
              </div>
            )}

            {data && !loading && !error && (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
