'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'mansions', name: 'Особняки', path: 'mansions' },
  { id: 'multipurpose', name: 'ПСН', path: 'multipurpose' },
  { id: 'dmv-cameras', name: 'DMV Камеры', path: 'dmv-cameras' },
  { id: 'captures', name: 'Капты', path: 'captures' },
  { id: 'family-wars', name: 'Войны семей', path: 'family-wars' },
  { id: 'arena', name: 'Арена', path: 'arena' },
  { id: 'rating-organizations', name: 'Рейтинг организаций', path: 'rating-organizations' },
  { id: 'mp_cars', name: 'МП: Транспорт', path: 'marketplace/cars' },
  { id: 'mp_items', name: 'МП: Предметы', path: 'marketplace/items' },
  { id: 'mp_houses', name: 'МП: Дома', path: 'marketplace/houses' },
  { id: 'mp_apartments', name: 'МП: Квартиры', path: 'marketplace/apartments' },
  { id: 'mp_offices', name: 'МП: Офисы', path: 'marketplace/offices' },
  { id: 'mp_clothes', name: 'МП: Одежда', path: 'marketplace/clothes' },
  { id: 'mp_adv', name: 'МП: Объявления', path: 'marketplace/advertisements' },
];

const SERVERS = [
  { id: 'RU1', name: 'New York' }, { id: 'RU2', name: 'Detroit' },
  { id: 'RU3', name: 'Chicago' }, { id: 'RU4', name: 'San Francisco' },
  { id: 'RU5', name: 'Atlanta' }, { id: 'RU6', name: 'San Diego' },
  { id: 'RU7', name: 'Los Angeles' }, { id: 'RU8', name: 'Miami' },
  { id: 'RU9', name: 'Las Vegas' }, { id: 'RU10', name: 'Washington' },
  { id: 'RU11', name: 'Dallas' }, { id: 'RU12', name: 'Boston' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [serverId, setServerId] = useState('RU1');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTabData() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(`/api/majestic?endpoint=${activeTab.path}/${serverId}`);
        const result = await response.json();

        if (result.error) throw new Error(result.error);

        const dataKey = Object.keys(result).find(key => Array.isArray(result[key]));
        
        setData({
          serverName: result.serverName,
          lastUpdated: result.lastUpdated,
          list: result[dataKey] || []
        });
      } catch (err) {
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    fetchTabData();
  }, [activeTab, serverId]);

  const currentServerName = SERVERS.find(s => s.id === serverId)?.name || serverId;

  return (
    <main className="min-h-screen bg-[#0F0F12] text-[#E0E0E6] font-sans antialiased">
      <header className="border-b border-[#22222A] bg-[#14141B] p-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-wider text-white">MAJESTIC <span className="text-[#E62E5C]">DASHBOARD</span></div>
            <select value={serverId} onChange={(e) => setServerId(e.target.value)} className="bg-[#1C1C24] border border-[#333344] text-white px-3 py-1.5 rounded-lg text-sm font-bold focus:outline-none focus:border-[#E62E5C] cursor-pointer">
              {SERVERS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
          </div>
          {data?.lastUpdated && (
            <div className="text-xs text-gray-500 bg-[#1C1C24] px-3 py-1 rounded-full border border-[#22222A]">
              Обновлено: {new Date(data.lastUpdated).toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-1 bg-[#14141B] p-4 rounded-xl border border-[#22222A] h-fit max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-gray-500 px-3 mb-2 uppercase tracking-wider">Разделы API</div>
          {CATEGORIES.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab.id === tab.id ? 'bg-[#E62E5C] text-white shadow-lg shadow-[#E62E5C]/20 font-bold' : 'text-gray-400 hover:bg-[#1C1C24] hover:text-white'}`}>
              {tab.name}
            </button>
          ))}
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-[#14141B] rounded-xl border border-[#22222A] p-6 min-h-[600px] flex flex-col shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#22222A] pb-4">
              <span>{activeTab.name}</span>
              <span className="text-xs font-semibold text-[#E62E5C] bg-[#E62E5C]/10 px-2.5 py-0.5 rounded-full border border-[#E62E5C]/20">{currentServerName}</span>
            </h2>

            {loading && <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3"><div className="w-9 h-9 border-4 border-[#E62E5C] border-t-transparent rounded-full animate-spin"></div><p className="text-sm">Синхронизация данных...</p></div>}
            {error && <div className="flex-1 flex items-center justify-center"><div className="bg-red-950/20 border border-red-900/50 text-red-400 p-6 rounded-xl text-sm max-w-md text-center"><p className="font-bold text-base mb-1">Ошибка лимитов</p><p className="text-xs text-red-300/70 mb-2">{error}</p><p className="text-xs text-gray-500">Система Majestic позволяет делать 5 запросов в минуту. Подождите немного.</p></div></div>}

            {!loading && !error && data && (
              <div className="flex-1">
                {data.list.length === 0 ? <div className="text-gray-500 text-center py-24 text-sm">Данные на сервере временно пусты.</div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.list.map((item, index) => {
                      const itemColor = item.familyMainColor || item.mainColor || '#2A2A35';
                      return (
                        <div key={index} className="bg-[#1C1C24] border border-[#2A2A35] p-4 rounded-xl flex flex-col justify-between hover:border-gray-700 transition-all duration-200" style={{ borderLeft: item.familyMainColor || item.mainColor ? `4px solid ${itemColor}` : '' }}>
                          <div>
                            {item.rank !== undefined && <div className="flex justify-between items-start mb-2"><div className="text-2xl font-black text-white bg-[#252530] w-10 h-10 rounded-lg flex items-center justify-center border border-[#333344]">#{item.rank}</div><div className="text-right text-xs"><p className="text-gray-500">Был ранг</p><p className="font-bold text-gray-300">#{item.prevRank || item.rank}</p></div></div>}
                            {(activeTab.id === 'dmv-cameras' || item.cameraId) && !item.carModel && !item.itemName && item.rank === undefined && <p className="font-bold text-white text-lg mb-2">Камера #{item.cameraId || item.id || index + 1}</p>}
                            {item.carModel && <p className="font-bold text-white text-lg tracking-tight">{item.carModel}</p>}
                            {item.itemName && <p className="font-bold text-white text-lg tracking-tight">{item.itemName}</p>}
                            {item.mansionName && <p className="font-bold text-white text-lg tracking-tight">{item.mansionName}</p>}
                            {item.name && item.rank !== undefined && <p className="font-bold text-white text-lg tracking-tight">{item.name}</p>}
                            {(item.houseId || item.apartmentId || item.officeId) && <p className="font-bold text-white text-lg">Имущество #{item.houseId || item.apartmentId || item.officeId}</p>}

                            {item.attackersName && (
                              <div className="mb-3 bg-[#252530] p-2.5 rounded-lg border border-[#333344] text-xs">
                                <div className="flex justify-between text-red-400"><span>Атака:</span><span className="text-white font-bold">{item.attackersName}</span></div>
                                <div className="text-center font-black text-gray-600 my-0.5">VS</div>
                                <div className="flex justify-between text-blue-400"><span>Защита:</span><span className="text-white font-bold">{item.defendersName}</span></div>
                                {item.selectedMapName && <p className="text-gray-400 mt-2 text-[11px]">Карта: <span className="text-gray-200">{item.selectedMapName}</span></p>}
                              </div>
                            )}

                            {item.gamemode && <div className="flex justify-between items-center mb-2"><span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">{item.gamemode}</span><span className={`text-xs font-bold ${item.status === 'Finished' ? 'text-gray-500' : 'text-green-400 animate-pulse'}`}>{item.status === 'Finished' ? 'Завершен' : 'В игре'}</span></div>}

                            <div className="mt-2 space-y-1 text-xs text-gray-400">
                              {item.zoneId && <p>Зона: <span className="text-gray-200">#{item.zoneId}</span></p>}
                              {item.gangZoneId && <p>Квадрат капта: <span className="text-gray-200">#{item.gangZoneId}</span></p>}
                              {(item.maxSpeed || item.speedLimit) && <p>Ограничение: <span className="text-yellow-400 font-bold">{item.maxSpeed || item.speedLimit} км/ч</span></p>}
                              {item.penalty && <p>Штраф: <span className="text-red-400">${item.penalty.toLocaleString()}</span></p>}
                              {item.creatorLogin && <p>Хост: <span className="text-gray-200">{item.creatorLogin}</span></p>}
                              {item.influence && <p>Влияние фракции: <span className="text-yellow-400 font-bold">{item.influence.toLocaleString()}</span></p>}
                              {item.count !== undefined && <p>Количество: <span className="text-gray-200">{item.count} шт.</span></p>}
                              {item.bank !== undefined && <p>Призовой банк: <span className="text-green-400 font-bold">${item.bank.toLocaleString()}</span></p>}
                              {item.minPrice && <p>Мин. цена: <span className="text-[#E62E5C] font-bold">${item.minPrice.toLocaleString()}</span></p>}
                              {item.avgPrice && <p>Средняя цена: <span className="text-green-400 font-semibold">${item.avgPrice.toLocaleString()}</span></p>}
                              {item.startAt && <p>Время старта: <span className="text-gray-400">{new Date(item.startAt).toLocaleTimeString('ru-RU')}</span></p>}
                            </div>
                          </div>

                          {(item.familyTag || item.tag) && (
                            <div className="mt-4 pt-3 border-t border-[#22222A] flex justify-between items-center text-xs">
                              <span className="text-gray-500">Контроль:</span>
                              <span className="px-2 py-0.5 rounded font-bold border" style={{ backgroundColor: (item.familyMainColor || item.mainColor) ? `${itemColor}15` : '#22222A', borderColor: (item.familyMainColor || item.mainColor) ? `${itemColor}40` : '#333344', color: (item.familyMainColor || item.mainColor) ? itemColor : '#FFF' }}>
                                [{item.familyTag || item.tag}] {item.familyName || ''}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
