import { useState, useEffect } from 'react';
import API from '../../utils/API';

const CacheDebug = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [allCaches, setAllCaches] = useState<Record<string, any>>({});
    const [selectedCache, setSelectedCache] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCacheData = () => {
        setLoading(true);
        API.get('/api/admin/all-caches')
            .then(response => {
                setAllCaches(response.data);
                const cacheNames = Object.keys(response.data);
                if (cacheNames.length > 0 && !selectedCache) {
                    setSelectedCache(cacheNames[0]);
                }
                setLoading(false)
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCacheData();
    }, []);

    if (loading) return <div className="text-center p-10 font-semibold text-gray-600">Összes gyorsítótár beolvasása...</div>;
    if (error) return <div className="p-5 text-red-600 font-bold bg-red-50 border border-red-200 rounded-lg m-6">Hiba történt: {error}</div>;

    const cacheNames = Object.keys(allCaches).sort();
    const currentCacheData = selectedCache ? allCaches[selectedCache] : {};
    const currentCacheKeys = Object.keys(currentCacheData);

    return (
        <div className="p-6 max-w-7xl mx-auto font-sans">
            {/* Fejléc */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 border rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rendszer Gyorsítótár Monitor (Caffeine)</h1>
                    <p className="text-gray-500 text-sm">A JHipster és a foglalási rendszer összes aktív memóriatárának valós idejű követése</p>
                </div>
                <button
                    onClick={fetchCacheData}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow transition duration-150 flex items-center gap-2"
                >
                    <span>Frissítés</span> 🔄
                </button>
            </div>

            {/* Kétosztatú elrendezés */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Bal oszlop: Cache-ek listája */}
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden h-[calc(100vh-220px)] overflow-y-auto">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                        <span className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Aktív Tárolók ({cacheNames.length})</span>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {cacheNames.map(name => {
                            const count = Object.keys(allCaches[name]).length;
                            const isSelected = selectedCache === name;
                            return (
                                <li key={name}>
                                    <button
                                        onClick={() => setSelectedCache(name)}
                                        className={`w-full text-left px-4 py-3 transition flex justify-between items-center ${isSelected
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-3'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span className="truncate text-sm font-mono mr-2">{name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Jobb oszlop: A kiválasztott Cache elemei */}
                <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm p-5 h-[calc(100vh-220px)] overflow-y-auto">
                    {selectedCache ? (
                        <div>
                            <div className="border-b pb-3 mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 font-mono text-indigo-600">{selectedCache}</h2>
                                <span className="text-sm text-gray-500 font-medium">Összesen: {currentCacheKeys.length} bejegyzés</span>
                            </div>

                            {currentCacheKeys.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                                    <p className="text-gray-400 italic text-sm">Ez a gyorsítótár jelenleg üres.</p>
                                    <p className="text-gray-400 text-xs mt-1">Nincs objektum betöltve a memóriába.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentCacheKeys.map(key => (
                                        <div key={key} className="border rounded-lg bg-gray-50 overflow-hidden border-gray-200">
                                            <div className="bg-gray-100 px-3 py-2 border-b font-mono text-xs font-bold text-gray-700 flex justify-between items-center">
                                                <span className="truncate mr-2">Kulcs: {key}</span>
                                                <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border text-gray-500 shadow-sm">Objektum</span>
                                            </div>
                                            <div className="p-3">
                                                <pre className="text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                                    {typeof currentCacheData[key] === 'object'
                                                        ? JSON.stringify(currentCacheData[key], null, 2)
                                                        : String(currentCacheData[key])}
                                                </pre>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-25 text-gray-400">Válassz ki egy gyorsítótárat a bal oldali listából!</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CacheDebug;