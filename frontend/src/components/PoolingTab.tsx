import React, { useState } from 'react';
import { ArrowRightLeft, Play } from 'lucide-react';

const MOCK_POOL = [
  { shipId: 'SHIP-A', cb: 5000 },  // Surplus
  { shipId: 'SHIP-B', cb: -2000 }, // Deficit
  { shipId: 'SHIP-C', cb: -1200 }, // Deficit
  { shipId: 'SHIP-D', cb: 800 },   // Surplus
];

export default function PoolingTab() {
  const [pool, setPool] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAllocation = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/pools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: MOCK_POOL })
      });
      const result = await response.json();
      setTimeout(() => {
        setPool(result);
        setLoading(false);
      }, 800);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Compliance Pooling</h2>
          <p className="text-slate-400 max-w-xl">
            Algorithm: <span className="text-blue-400 font-mono">Greedy Allocation</span>. 
            Surplus from compliant ships is automatically distributed to deficit ships to minimize fleet-wide penalties.
          </p>
        </div>
        <button 
          onClick={runAllocation}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : <><Play size={18} fill="currentColor" /> Simulate Pool</>}
        </button>
      </div>

      {pool.length > 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="p-5 font-medium">Ship ID</th>
                <th className="p-5 text-right font-medium">Initial Balance</th>
                <th className="p-5 text-center font-medium">Action</th>
                <th className="p-5 text-right font-medium">Final Balance</th>
                <th className="p-5 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm text-slate-200">
              {pool.map((ship) => {
                const diff = ship.cb_after - ship.cb_before;
                return (
                  <tr key={ship.shipId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-5 font-mono text-slate-400">{ship.shipId}</td>
                    <td className={`p-5 text-right font-mono ${ship.cb_before < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {ship.cb_before}
                    </td>
                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${diff < 0 ? 'bg-blue-500/10 text-blue-400' : diff > 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                        {diff !== 0 && <ArrowRightLeft size={12} />}
                        {diff > 0 ? `Receives ${diff}` : diff < 0 ? `Donates ${Math.abs(diff)}` : 'No Change'}
                      </div>
                    </td>
                    <td className="p-5 text-right font-bold font-mono text-white">
                      {ship.cb_after}
                    </td>
                    <td className="p-5 text-center">
                      {ship.cb_after >= 0 
                        ? <span className="text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-full">Compliant</span>
                        : <span className="text-rose-400 text-[10px] uppercase font-bold border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 rounded-full">Deficit</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
          Click "Simulate Pool" to run the algorithm
        </div>
      )}
    </div>
  );
}