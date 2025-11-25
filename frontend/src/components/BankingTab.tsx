import React, { useState } from 'react';
import { History, PiggyBank, ArrowUpRight } from 'lucide-react';

export default function BankingTab() {
  const [balance, setBalance] = useState(15000);
  const [amount, setAmount] = useState('');

  const handleBank = () => {
    if (!amount) return;
    setBalance(prev => prev + Number(amount));
    setAmount('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/20 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><PiggyBank size={120} /></div>
        
        <h3 className="text-blue-100/80 uppercase tracking-widest text-xs font-bold mb-6 relative z-10">Available Surplus Balance</h3>
        <div className="text-6xl font-mono font-bold text-white mb-2 relative z-10 tracking-tighter">
          {(balance / 1000).toFixed(2)}
        </div>
        <div className="text-lg text-blue-200 mb-8 relative z-10 font-medium">Tonnes CO2eq</div>
      </div>

      {/* Action Card */}
      <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl backdrop-blur-sm flex flex-col justify-center">
        <h3 className="text-white text-xl font-bold mb-2">Bank New Surplus</h3>
        <p className="text-slate-400 text-sm mb-8">Store excess compliance units for future years or pooling.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount to Bank</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="flex-1 bg-slate-900 border border-slate-600 text-white px-5 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
              />
              <button 
                onClick={handleBank}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                Bank <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}