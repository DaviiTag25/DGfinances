import React, { useState } from 'react';
import { View } from './types';
import { Home } from './views/Home';
import { MortgageCalculator } from './views/MortgageCalculator';
import { LeasingCalculator } from './views/LeasingCalculator';
import { CapacityCalculator } from './views/CapacityCalculator';
import { CarLoanCalculator } from './views/CarLoanCalculator';
import { UsageGuard } from './components/UsageGuard';
import { Layers, Mail, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  const renderView = () => {
    switch (currentView) {
      case View.MORTGAGE:
        return (
          <UsageGuard>
            <MortgageCalculator onBack={() => setCurrentView(View.HOME)} />
          </UsageGuard>
        );
      case View.LEASING:
        return (
          <UsageGuard>
            <LeasingCalculator onBack={() => setCurrentView(View.HOME)} />
          </UsageGuard>
        );
      case View.CAPACITY:
        return (
          <UsageGuard>
            <CapacityCalculator onBack={() => setCurrentView(View.HOME)} />
          </UsageGuard>
        );
      case View.AUTO:
        return (
          <UsageGuard>
            <CarLoanCalculator onBack={() => setCurrentView(View.HOME)} />
          </UsageGuard>
        );
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-dg-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dg-800 via-dg-900 to-black text-gray-100 selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="py-6 flex flex-col md:flex-row justify-between items-center border-b border-white/5 mb-6 gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentView(View.HOME)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
              <Layers className="text-white" size={20} />
            </div>
            <div>
                <div className="font-bold text-xl tracking-tight text-white leading-none">DGFINANCES</div>
                <div className="text-xs text-blue-400 font-medium tracking-wide">CALCULATOR SUITE</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-400">
             <a href="mailto:kontak@dgloans.net" className="flex items-center gap-2 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                <Mail size={14} /> kontak@dgloans.net
             </a>
             <a href="tel:+48533877454" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-colors shadow-lg shadow-blue-900/30">
                <Phone size={14} /> +48 533 877 454
             </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow flex flex-col justify-center">
            {renderView()}
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} DGFINANCES. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-2 text-xs text-gray-700">
            Wyniki prezentowane w kalkulatorach mają charakter szacunkowy i nie stanowią oferty w rozumieniu przepisów Kodeksu Cywilnego.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;