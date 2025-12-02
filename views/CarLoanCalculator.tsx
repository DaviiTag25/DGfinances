import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { Button, Card, Slider } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, Car, Calendar, Percent, CircleDollarSign } from 'lucide-react';

export const CarLoanCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const currentYear = new Date().getFullYear();
  const [price, setPrice] = useState(85000);
  const [ownContribution, setOwnContribution] = useState(15000);
  const [months, setMonths] = useState(60);
  const [age, setAge] = useState(currentYear - 1);

  const calculateCarLoan = () => {
    const loanAmount = Math.max(0, price - ownContribution);
    const rate = 9.5; 
    const r = rate / 100 / 12;
    
    if (loanAmount <= 0) return { pmt: 0, total: 0, loanAmount: 0 };
    
    const pmt = (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    
    return {
      pmt,
      total: pmt * months,
      loanAmount
    };
  };

  const { pmt, total, loanAmount } = calculateCarLoan();
  const financingPercent = (loanAmount / price) * 100;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kredyt Samochodowy</h2>
          <p className="text-gray-400">Finansowanie zakupu auta nowego lub używanego</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-orange-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Car size={20} className="text-orange-500" />
              Konfiguracja Pojazdu
            </h3>
            
            <div className="space-y-8">
              <Slider 
                label="Cena samochodu"
                value={price}
                min={15000}
                max={400000}
                step={1000}
                suffix="PLN"
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <Slider 
                label="Wpłata własna"
                value={ownContribution}
                min={0}
                max={price * 0.9}
                step={1000}
                suffix="PLN"
                onChange={(e) => setOwnContribution(Number(e.target.value))}
              />
              
              <div className="bg-dg-900/50 p-4 rounded-xl border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                     <label className="text-sm font-medium text-gray-400">Rocznik pojazdu</label>
                     <Calendar size={16} className="text-orange-500" />
                 </div>
                 <Slider 
                   label=""
                   min={currentYear - 10}
                   max={currentYear + 1}
                   value={age}
                   onChange={(e) => setAge(Number(e.target.value))}
                   step={1}
                   suffix=""
                 />
                 <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{currentYear - 10} (10 lat)</span>
                    <span className="text-orange-400 font-bold">{age}</span>
                    <span>{currentYear + 1} (Nowy)</span>
                 </div>
              </div>

               <Slider 
                label="Okres kredytowania"
                value={months}
                min={12}
                max={120}
                step={12}
                suffix="msc"
                onChange={(e) => setMonths(Number(e.target.value))}
              />
            </div>
          </Card>
          
          <ContactForm context={`Auto: ${price} PLN, rocznik ${age}`} />
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-br from-dg-800 to-orange-900/20 border-orange-500/30 relative overflow-hidden shadow-2xl shadow-orange-900/10">
             {/* Big Icon Background */}
             <Car className="absolute -right-8 -top-8 text-white/5 w-64 h-64 pointer-events-none" />
             
             <div className="relative z-10 text-center py-8">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">Twoja Rata Miesięczna</p>
                <div className="text-6xl font-extrabold text-white tracking-tight mb-2">
                  {pmt.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-2xl text-gray-400 font-normal">PLN</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/5">
                    <CircleDollarSign size={12} />
                    Kwota kredytu: {loanAmount.toLocaleString()} PLN
                </div>
             </div>
             
             <div className="relative z-10 bg-dg-900/40 p-6 backdrop-blur-sm border-t border-white/5">
                 <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Finansowanie</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-dg-700 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{width: `${financingPercent}%`}}></div>
                            </div>
                            <span className="text-white font-bold text-sm">{financingPercent.toFixed(0)}%</span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mt-4">
                         <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                             <span className="text-xs text-gray-500 block mb-1">Całkowity koszt</span>
                             <span className="text-white font-bold">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                         </div>
                          <div className="p-3 bg-dg-800 rounded-lg border border-dg-700">
                             <span className="text-xs text-gray-500 block mb-1">RRSO (Szac.)</span>
                             <span className="text-orange-400 font-bold">~11.2%</span>
                         </div>
                     </div>
                 </div>
             </div>
          </Card>
          
          <Card className="border border-white/5">
            <div className="flex flex-col gap-4">
                 <h4 className="text-white font-semibold flex items-center gap-2">
                     <Car size={18} className="text-orange-500"/>
                     Samochody Dostępne Od Ręki
                 </h4>
                 <p className="text-sm text-gray-400 leading-relaxed">
                     Współpracujemy z największymi dealerami w Polsce. Możemy znaleźć dla Ciebie ten model w lepszej cenie.
                 </p>
                 <Button variant="outline" className="text-sm py-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 group">
                    Znajdź auto dla mnie
                 </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};