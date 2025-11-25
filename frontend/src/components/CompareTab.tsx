import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CompareTab() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/routes/comparison')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-12 text-center text-slate-500 animate-pulse">Analyzing data...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Performance vs Baseline</h2>
            <p className="text-slate-400 text-sm">Comparison against standard HFO baseline routes</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Baseline Intensity</div>
            <div className="text-2xl font-mono text-white font-bold">{data.baseline.ghgie_actual.toFixed(2)} <span className="text-sm text-slate-500 font-sans font-normal">gCO2e/MJ</span></div>
          </div>
        </div>

        <div className="space-y-3">
          {data.comparisons.map((item: any) => (
            <div key={item.routeId} className="group bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="w-20 font-mono text-slate-400 text-sm">{item.routeId}</div>
                
                <div className="flex-1 relative h-12 flex items-center">
                  {/* Background Bar */}
                  <div className="absolute inset-0 bg-slate-800 rounded-lg overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10"></div>
                  </div>
                  
                  {/* Value Bar */}
                  <div className="relative w-full h-2 bg-slate-700/30 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${item.percentDiff < 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ 
                          width: `${Math.min(Math.abs(item.percentDiff) * 4, 50)}%`,
                          marginLeft: item.percentDiff > 0 ? '50%' : `calc(50% - ${Math.min(Math.abs(item.percentDiff) * 4, 50)}%)`
                        }}
                      />
                  </div>
                </div>

                <div className="w-32 text-right">
                  <div className={`text-lg font-bold font-mono ${item.percentDiff > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {item.percentDiff > 0 ? '+' : ''}{item.percentDiff.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Deviation</div>
                </div>
                
                <div className="w-8 flex justify-center text-slate-600">
                    <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}