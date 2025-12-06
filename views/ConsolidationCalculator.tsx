import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { Button, Card, Slider } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, RefreshCw, CreditCard, Percent, TrendingDown, CircleDollarSign, Plus, Trash2 } from 'lucide-react';

interface Loan {
  id: number;
  name: string;
  amount: number;
  rate: number;
  installment: number;
}

export const ConsolidationCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [loans, setLoans] = useState<Loan[]>([
    { id: 1, name: 'Kredyt 1', amount: 30000, rate: 12, installment: 800 },
    { id: 2, name: 'Kredyt 2', amount: 20000, rate: 10, installment: 550 },
  ]);
  const [consolidationMonths, setConsolidationMonths] = useState(84);
  const [consolidationRate, setConsolidationRate] = useState(7.5);

  const addLoan = () => {
    const newId = Math.max(...loans.map(l => l.id), 0) + 1;
    setLoans([...loans, { 
      id: newId, 
      name: `Kredyt ${newId}`, 
      amount: 10000, 
      rate: 10, 
      installment: 300 
    }]);
  };

  const removeLoan = (id: number) => {
    if (loans.length > 1) {
      setLoans(loans.filter(l => l.id !== id));
    }
  };

  const updateLoan = (id: number, field: keyof Loan, value: string | number) => {
    setLoans(loans.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const calculateConsolidation = () => {
    const totalDebt = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const currentTotalInstallment = loans.reduce((sum, loan) => sum + loan.installment, 0);
    
    const r = consolidationRate / 100 / 12;
    const newInstallment = totalDebt > 0 
      ? (totalDebt * r * Math.pow(1 + r, consolidationMonths)) / (Math.pow(1 + r, consolidationMonths) - 1)
      : 0;
    
    const newTotal = newInstallment * consolidationMonths;
    const savings = currentTotalInstallment - newInstallment;
    const savingsPercent = currentTotalInstallment > 0 ? (savings / currentTotalInstallment) * 100 : 0;
    
    return {
      totalDebt,
      currentTotalInstallment,
      newInstallment,
      newTotal,
      savings,
      savingsPercent
    };
  };

  const result = calculateConsolidation();
  const rrso = consolidationRate * 1.12;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kredyt Konsolidacyjny</h2>
          <p className="text-gray-400">Połącz wszystkie zobowiązania w jedną niższą ratę</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-indigo-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard size={20} className="text-indigo-500" />
                Twoje Obecne Zobowiązania
              </h3>
              <Button 
                variant="outline" 
                onClick={addLoan}
                className="!px-3 !py-2 text-xs hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
              >
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              {loans.map((loan, index) => (
                <div key={loan.id} className="bg-dg-900/50 p-4 rounded-xl border border-white/5 relative group">
                  {loans.length > 1 && (
                    <button
                      onClick={() => removeLoan(loan.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  
                  <input
                    type="text"
                    value={loan.name}
                    onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                    className="bg-transparent border-none text-white font-medium mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                  />
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Kwota</label>
                      <input
                        type="number"
                        value={loan.amount}
                        onChange={(e) => updateLoan(loan.id, 'amount', Number(e.target.value))}
                        className="w-full bg-dg-800 border border-dg-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Oprocentowanie</label>
                      <input
                        type="number"
                        step="0.1"
                        value={loan.rate}
                        onChange={(e) => updateLoan(loan.id, 'rate', Number(e.target.value))}
                        className="w-full bg-dg-800 border border-dg-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Rata</label>
                      <input
                        type="number"
                        value={loan.installment}
                        onChange={(e) => updateLoan(loan.id, 'installment', Number(e.target.value))}
                        className="w-full bg-dg-800 border border-dg-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-t-4 border-t-indigo-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <RefreshCw size={20} className="text-indigo-500" />
              Parametry Konsolidacji
            </h3>
            
            <div className="space-y-8">
              <Slider 
                label="Okres kredytowania"
                value={consolidationMonths}
                min={24}
                max={120}
                step={12}
                suffix="msc"
                onChange={(e) => setConsolidationMonths(Number(e.target.value))}
              />
              
              <div className="bg-dg-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Oprocentowanie roczne</label>
                  <Percent size={16} className="text-indigo-500" />
                </div>
                <Slider 
                  label=""
                  min={5}
                  max={12}
                  value={consolidationRate}
                  onChange={(e) => setConsolidationRate(Number(e.target.value))}
                  step={0.1}
                  suffix="%"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5% (Najniższe)</span>
                  <span className="text-indigo-400 font-bold">{consolidationRate}%</span>
                  <span>12% (Najwyższe)</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-white/5 bg-dg-800/30">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <RefreshCw size={18} className="text-indigo-500"/>
              Kredyt Konsolidacyjny - Informacje
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-indigo-400 font-semibold mb-1">Czym jest konsolidacja kredytów?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Połączenie wszystkich Twoich zobowiązań (kredyty, karty, pożyczki) w jeden nowy kredyt z niższą ratą miesięczną i często lepszym oprocentowaniem.
                </p>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-indigo-400 font-semibold mb-2">Warunki kredytu:</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Kwota:</strong> Do 200 000 PLN (suma wszystkich długów)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Okres:</strong> Do 120 miesięcy (wydłużenie okresu = niższa rata)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Oprocentowanie:</strong> 5-12%, często niższe niż średnia obecnych</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Co łączymy:</strong> Kredyty, karty, pożyczki, limity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Korzyści:</strong> Jedna rata, niższe obciążenie, lepszy budżet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Dodatkowa gotówka:</strong> Możliwość dołączenia nowych środków</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          
          <ContactForm context={`Konsolidacja ${loans.length} kredytów: ${result.totalDebt.toLocaleString()} PLN`} />
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-br from-dg-800 to-indigo-900/20 border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-900/10">
            {/* Big Icon Background */}
            <RefreshCw className="absolute -right-8 -top-8 text-white/5 w-64 h-64 pointer-events-none" />
            
            <div className="relative z-10 text-center py-8">
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Nowa Rata Miesięczna</p>
              <div className="text-6xl font-extrabold text-white tracking-tight mb-2">
                {result.newInstallment.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-2xl text-gray-400 font-normal">PLN</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/5">
                <CircleDollarSign size={12} />
                Oszczędzasz {result.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN/msc
              </div>
            </div>
            
            <div className="relative z-10 bg-dg-900/40 p-6 backdrop-blur-sm border-t border-white/5">
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Oszczędność na racie</span>
                    <TrendingDown className="text-green-400" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {result.savingsPercent.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {result.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN miesięcznie
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Było</span>
                    <span className="text-red-400 font-bold line-through">{result.currentTotalInstallment.toLocaleString()} PLN</span>
                  </div>
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Będzie</span>
                    <span className="text-green-400 font-bold">{result.newInstallment.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">Suma zobowiązań</span>
                    <span className="text-white font-bold">{result.totalDebt.toLocaleString()} PLN</span>
                  </div>
                  <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                    <span className="text-xs text-gray-500 block mb-1">RRSO (Szac.)</span>
                    <span className="text-indigo-400 font-bold">{rrso.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border border-white/5">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500"/>
                Co można skonsolidować?
              </h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2 p-2 bg-dg-800/50 rounded-lg">
                  <span className="text-indigo-400">•</span>
                  <span>Kredyty gotówkowe</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-dg-800/50 rounded-lg">
                  <span className="text-indigo-400">•</span>
                  <span>Karty kredytowe</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-dg-800/50 rounded-lg">
                  <span className="text-indigo-400">•</span>
                  <span>Kredyty ratalne</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-dg-800/50 rounded-lg">
                  <span className="text-indigo-400">•</span>
                  <span>Pożyczki pozabankowe</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
