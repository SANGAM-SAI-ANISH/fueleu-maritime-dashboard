import React, { useState } from 'react';
import { LayoutDashboard, Scale, Landmark, Users } from 'lucide-react';
import RoutesTab from './components/RoutesTab';
import CompareTab from './components/CompareTab';
import BankingTab from './components/BankingTab';
import PoolingTab from './components/PoolingTab';

const TABS = [
  { id: 'Routes', icon: LayoutDashboard, label: 'Routes' },
  { id: 'Compare', icon: Scale, label: 'Compare' },
  { id: 'Banking', icon: Landmark, label: 'Banking' },
  { id: 'Pooling', icon: Users, label: 'Pooling' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Routes');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">F</div>
            <h1 className="text-xl font-bold tracking-tight text-white">FuelEU <span className="text-slate-500 font-normal">Maritime</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              Target 2025: <span className="text-emerald-400 font-bold">89.34</span> gCO2e/MJ
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 mt-8 mb-8">
        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl w-fit border border-slate-700/50 backdrop-blur-sm">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'Routes' && <RoutesTab />}
          {activeTab === 'Compare' && <CompareTab />}
          {activeTab === 'Banking' && <BankingTab />}
          {activeTab === 'Pooling' && <PoolingTab />}
        </div>
      </main>
    </div>
  );
}

export default App;