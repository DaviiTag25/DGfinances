import React from 'react';
import { View } from '../types';
import { Home as HomeIcon, Key, TrendingUp, Car, Wallet, RefreshCw } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: View) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      id: View.MORTGAGE,
      title: "Kredyt Hipoteczny",
      desc: "Oblicz ratę, harmonogram i LTV dla swojego wymarzonego domu.",
      icon: HomeIcon,
      color: "blue",
      badge: "Najpopularniejszy"
    },
    {
      id: View.LEASING,
      title: "Leasing",
      desc: "Kalkulacja leasingu operacyjnego i finansowego dla Twojej firmy.",
      icon: Key,
      color: "green",
      badge: "Dla Firm"
    },
    {
      id: View.CAPACITY,
      title: "Zdolność Kredytowa",
      desc: "Sprawdź na jaki kredyt Cię stać analizując dochody i koszty.",
      icon: TrendingUp,
      color: "purple",
      badge: "Analiza"
    },
    {
      id: View.AUTO,
      title: "Kredyt Samochodowy",
      desc: "Sfinansuj zakup nowego lub używanego pojazdu.",
      icon: Car,
      color: "orange",
      badge: "Nowość"
    },
    {
      id: View.CASH_LOAN,
      title: "Kredyt Gotówkowy",
      desc: "Pieniądze na dowolny cel bez zabezpieczeń.",
      icon: Wallet,
      color: "emerald",
      badge: "Szybko"
    },
    {
      id: View.CONSOLIDATION,
      title: "Konsolidacja",
      desc: "Połącz wszystkie zobowiązania w jedną niższą ratę.",
      icon: RefreshCw,
      color: "indigo",
      badge: "Oszczędzaj"
    }
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover:border-blue-500 group-hover:shadow-blue-900/20',
      green: 'bg-green-500/10 text-green-500 border-green-500/20 group-hover:border-green-500 group-hover:shadow-green-900/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20 group-hover:border-purple-500 group-hover:shadow-purple-900/20',
      orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:border-orange-500 group-hover:shadow-orange-900/20',
      emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:border-emerald-500 group-hover:shadow-emerald-900/20',
      indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 group-hover:border-indigo-500 group-hover:shadow-indigo-900/20',
    };
    return map[color];
  };

  return (
    <div className="py-8">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 tracking-tight">
          Panel Finansowy
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Profesjonalne narzędzia do obliczania Twoich możliwości finansowych.
          Wybierz kalkulator, aby rozpocząć.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <button
            key={feature.id}
            onClick={() => onNavigate(feature.id)}
            className={`group relative text-left p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:bg-dg-800/50 bg-dg-800/30 backdrop-blur-sm ${getColorClasses(feature.color)} animate-in fade-in zoom-in-95 duration-500`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-dg-900/50 backdrop-blur border border-white/5`}>
              {feature.badge}
            </div>
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-dg-900 border border-white/5 shadow-inner`}>
              <feature.icon size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {feature.desc}
            </p>
            
            <div className="mt-6 flex items-center text-sm font-semibold opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Otwórz kalkulator <span className="ml-2">→</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-20 border-t border-dg-800 pt-10 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-gray-500 text-sm">
            Potrzebujesz indywidualnej konsultacji? 
            <a href="tel:+48533877454" className="text-blue-400 hover:text-blue-300 ml-1 transition-colors">Skontaktuj się z ekspertem DGFINANCES</a>
        </p>
      </div>
    </div>
  );
};
