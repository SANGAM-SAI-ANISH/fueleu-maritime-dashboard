import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Ship } from 'lucide-react';

interface RouteData {
  routeId: string;
  vesselType: string;
  fuelType: string;
  ghgie_actual: number;
  compliance_balance: number;
  penalty_eur: number;
  is_compliant: boolean;
}

export default function RoutesTab() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch routes:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading fleet data...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Fleet Avg GHG Intensity" value="87.30" unit="gCO2e/MJ" status="good" />
        <KpiCard 
          title="Total Compliance Balance" 
          value={(routes.reduce((acc, r) => acc + r.compliance_balance, 0) / 1000).toFixed(1)} 
          unit="tCO2e" 
          status={routes.reduce((acc, r) => acc + r.compliance_balance, 0) >= 0 ? 'good' : 'bad'} 
        />
        <KpiCard 
          title="Total Penalty Exposure" 
          value={`€${(routes.reduce((acc, r) => acc + r.penalty_eur, 0) / 1000).toFixed(1)}k`} 
          unit="EUR" 
          status={routes.some(r => r.penalty_eur > 0) ? 'warning' : 'good'} 
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
              <th className="p-5 font-medium">Route ID</th>
              <th className="p-5 font-medium">Vessel</th>
              <th className="p-5 font-medium">Fuel Type</th>
              <th className="p-5 text-right font-medium">GHG Intensity</th>
              <th className="p-5 text-right font-medium">Compliance Balance</th>
              <th className="p-5 text-right font-medium">Penalty</th>
              <th className="p-5 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm text-slate-200">
            {routes.map((r) => (
              <tr key={r.routeId} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-5 font-mono text-slate-400">{r.routeId}</td>
                <td className="p-5 flex items-center gap-3 font-medium">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Ship size={16} /></div>
                  {r.vesselType}
                </td>
                <td className="p-5"><FuelBadge type={r.fuelType} /></td>
                <td className="p-5 text-right font-mono text-slate-300">{r.ghgie_actual.toFixed(2)}</td>
                <td className={`p-5 text-right font-mono font-medium ${r.compliance_balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(r.compliance_balance / 1000).toFixed(2)} t
                </td>
                <td className="p-5 text-right text-slate-400 font-mono">
                  {r.penalty_eur > 0 ? `€${r.penalty_eur.toLocaleString()}` : '-'}
                </td>
                <td className="p-5 text-center">
                  {r.is_compliant 
                    ? <div className="flex justify-center"><CheckCircle2 size={18} className="text-emerald-500" /></div>
                    : <div className="flex justify-center"><AlertCircle size={18} className="text-rose-500" /></div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper Components
function KpiCard({ title, value, unit, status }: any) {
  const colors = status === 'good' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
    : status === 'warning' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    : 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    
  return (
    <div className={`p-6 rounded-2xl border ${colors} backdrop-blur-sm`}>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
      <div className="text-3xl font-bold tracking-tight flex items-baseline gap-2">
        {value}
        <span className="text-sm font-normal text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function FuelBadge({ type }: { type: string }) {
  const isGreen = type.includes('LNG') || type.includes('BIO') || type.includes('METHANOL');
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide ${
      isGreen 
        ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' 
        : 'border-slate-600 text-slate-400 bg-slate-800'
    }`}>
      {type}
    </span>
  );
}