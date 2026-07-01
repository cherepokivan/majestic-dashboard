'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [server, setServer] = useState('RU1');
  const [activeTab, setActiveTab] = useState('mansions');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'mansions', name: 'Особняки' },
    { id: 'multipurpose', name: 'ПСН' },
    { id: 'captures', name: 'Капты' },
    { id: 'family-wars', name: 'Войны семей' },
    { id: 'arena', name: 'Арена' },
    { id: 'rating-organizations', name: 'Рейтинг фракций' },
  ];

  const servers = ['RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6', 'RU7', 'RU8', 'RU9', 'RU10', 'RU11', 'RU12'];

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-magenta-500 selection:text-white">
      {/* Шапка сайта */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider text-white uppercase">Majestic Dashboard</h1>
        </div>
        
        {/* Выбор сервера */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Сервер:</span>
          <select 
            value={server} 
            onChange={(e) => setServer(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {servers.map(srv => (
              <option key={srv} value={srv}>{srv}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Навигация по вкладкам */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Контентная зона */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.name} <span className="text-red-500 text-lg">[{server}]</span>
            </h2>

            {/* ИНДИКАТОР ЗАГРУЗКИ */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 animate-pulse">Получение актуальных данных от Majestic API...</p>
              </div>
            )}

            {/* ОШИБКА */}
            {error && !loading && (
              <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 text-red-200 text-sm">
                <div className="font-semibold text-base mb-1">⚠️ Ошибка синхронизации (fetch failed)</div>
                <p className="text-red-300/80 mb-3">Сервер хостинга временно заблокирован защитой Cloudflare со стороны Majestic.</p>
                <div className="bg-black/30 p-2.5 rounded font-mono text-xs text-red-400 break-all">
                  Лог ошибки: {error}
                </div>
              </div>
            )}

            {/* ВЫВОД ДАННЫХ */}
            {data && !loading && !error && (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Подвал карточки */}
          <footer className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
            <div>Лимит запросов к API: 5 запросов / 60 сек</div>
            <div>Данные обновляются в реальном времени</div>
          </footer>
        </div>
      </main>
    </div>
  );
              }
