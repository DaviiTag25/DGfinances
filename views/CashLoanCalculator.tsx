import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { Button, Card, Slider } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, Wallet, Calendar, Percent, TrendingUp, CircleDollarSign } from 'lucide-react';

export const CashLoanCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(8.5);

  const calculateCashLoan = () => {
    const r = rate / 100 / 12;
    
    if (amount <= 0 || months <= 0) return { pmt: 0, total: 0, totalInterest: 0 };
    
    const pmt = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = pmt * months;
    const totalInterest = total - amount;
    
    return {
      pmt,
      total,
      totalInterest
    };
  };

  const { pmt, total, totalInterest } = calculateCashLoan();
  const rrso = rate * 1.15; // Uproszczone RRSO

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kredyt Gotówkowy</h2>
          <p className="text-gray-400">Pieniądze na dowolny cel bez zabezpieczeń</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-emerald-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Wallet size={20} className="text-emerald-500" />
              Parametry Kredytu
            </h3>
            
            <div className="space-y-8">
              <Slider 
                label="Kwota kredytu"
                value={amount}
                min={5000}
                max={200000}
                step={1000}
                suffix="PLN"
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <Slider 
                label="Okres kredytowania"
                value={months}
                min={12}
                max={120}
                step={12}
                suffix="msc"
                onChange={(e) => setMonths(Number(e.target.value))}
              />
              
              <div className="bg-dg-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Oprocentowanie roczne</label>
                  <Percent size={16} className="text-emerald-500" />
                </div>
                <Slider 
                  label=""
                  min={5}
                  max={15}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  step={0.1}
                  suffix="%"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5% (Najniższe)</span>
                  <span className="text-emerald-400 font-bold">{rate}%</span>
                  <span>15% (Najwyższe)</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-white/5 bg-dg-800/30">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Wallet size={18} className="text-emerald-500"/>
              Kredyt Gotówkowy - Informacje
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-emerald-400 font-semibold mb-1">Czym jest kredyt gotówkowy?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Uniwersalny kredyt bez określonego celu - środki możesz przeznaczyć na dowolny wydatek. Nie wymaga zabezpieczeń, szybka decyzja kredytowa.
                </p>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-emerald-400 font-semibold mb-2">Warunki kredytu:</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Kwota:</strong> Od 5 000 do 200 000 PLN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Okres:</strong> Od 12 do 120 miesięcy (1-10 lat)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Oprocentowanie:</strong> 5-15% w zależności od zdolności</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Zabezpieczenie:</strong> Brak (kredyt niezabezpieczony)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Cel kredytu:</strong> Dowolny - nie musisz go określać</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span><strong>Decyzja:</strong> Online w 15 minut, wypłata w 24h</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          
          <ContactForm context={`Kredyt gotówkowy: ${amount.toLocaleString()} PLN na ${months} msc`} />
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-br from-dg-800 to-emerald-900/20 border-emerald-500/30 relative overflow-hidden shadow-2xl shadow-emerald-900/10">
            {/* Big Icon Background */}
            <Wallet className="absolute -right-8 -top-8 text-white/5 w-64 h-64 pointer-events-none" />
            
            <div className="relative z-10 text-center py-8">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Twoja Rata Miesięczna</p>
              <div className="text-6xl font-extrabold text-white tracking-tight mb-2">
                {pmt.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-2xl text-gray-400 font-normal">PLN</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/5">
                <CircleDollarSign size={12} />
                Na okres {months} miesięcy
              </div>
            </div>
            
            <div className="relative z-10 bg-dg-900/40 p-6 backdrop-blur-sm border-t border-white/5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Całkowity koszt</span>
                    <span className="text-white font-bold">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                  </div>
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Odsetki</span>
                    <span className="text-emerald-400 font-bold">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Oprocentowanie</span>
                    <span className="text-white font-bold">{rate.toFixed(2)}%</span>
                  </div>
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">RRSO (Szac.)</span>
                    <span className="text-emerald-400 font-bold">{rrso.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border border-white/5">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500"/>
                Najczęstsze Cele Kredytu
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-dg-800/50 rounded-lg border border-white/5">
                  <span className="text-gray-400">🏠 Remont mieszkania</span>
                </div>
                <div className="p-2 bg-dg-800/50 rounded-lg border border-white/5">
                  <span className="text-gray-400">🎓 Edukacja</span>
                </div>
                <div className="p-2 bg-dg-800/50 rounded-lg border border-white/5">
                  <span className="text-gray-400">✈️ Urlop marzeń</span>
                </div>
                <div className="p-2 bg-dg-800/50 rounded-lg border border-white/5">
                  <span className="text-gray-400">💍 Ślub</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Kredyt gotówkowy nie wymaga podawania celu - możesz przeznaczyć środki na dowolny wydatek.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
