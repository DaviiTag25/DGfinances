import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { Button, Card, Slider } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, Check, PieChart, ShieldCheck, Briefcase, Coins } from 'lucide-react';

export const LeasingCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [price, setPrice] = useState(100000); 
  const [initialFeePercent, setInitialFeePercent] = useState(10);
  const [redemptionPercent, setRedemptionPercent] = useState(1);
  const [period, setPeriod] = useState(36);
  const [isInputNet, setIsInputNet] = useState(true); 
  
  const [taxRate, setTaxRate] = useState(19);
  const [isVatPayer, setIsVatPayer] = useState(true);

  const toggleVatMode = (modeIsNet: boolean) => {
    if (modeIsNet === isInputNet) return;
    if (modeIsNet) {
        setPrice(Math.round(price / 1.23));
    } else {
        setPrice(Math.round(price * 1.23));
    }
    setIsInputNet(modeIsNet);
  };

  const calculateLeasing = () => {
    const baseNetPrice = isInputNet ? price : (price / 1.23);
    
    // Leasing logic
    const baseRate = 1.05; 
    const timeRisk = (period / 12) * 0.025;
    const amountRisk = baseNetPrice > 200000 ? -0.01 : 0;
    
    const leasingFactor = baseRate + timeRisk + amountRisk;
    const totalLeasingCostNet = baseNetPrice * leasingFactor;
    
    const initialFeeAmount = baseNetPrice * (initialFeePercent / 100);
    const redemptionAmount = baseNetPrice * (redemptionPercent / 100);
    
    const financedAmount = totalLeasingCostNet - initialFeeAmount - redemptionAmount;
    const monthlyInstallment = financedAmount / period;

    // Tax Shield
    const incomeTaxShield = totalLeasingCostNet * (taxRate / 100);
    const vatShield = isVatPayer ? (totalLeasingCostNet * 0.23) : 0;
    const totalTaxBenefit = incomeTaxShield + vatShield;
    
    const grossTotalOutflow = totalLeasingCostNet * 1.23;
    const realCost = grossTotalOutflow - totalTaxBenefit;

    return {
      baseNetPrice,
      monthlyInstallment, 
      initialFeeAmount, 
      redemptionAmount,
      totalLeasingCostNet,
      totalSumPercent: (leasingFactor * 100),
      incomeTaxShield,
      vatShield,
      realCost,
      totalTaxBenefit
    };
  };

  const result = calculateLeasing();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kalkulator Leasingowy</h2>
          <p className="text-gray-400">Oferta dla firm z analizą korzyści podatkowych</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-green-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-green-500" />
                Parametry Przedmiotu
              </h3>
              
              {/* Custom Toggle */}
              <div className="bg-dg-900 p-1 rounded-lg border border-dg-700 flex relative w-full sm:w-auto">
                <button 
                  onClick={() => toggleVatMode(true)}
                  className={`relative z-10 flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isInputNet ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Netto
                </button>
                <button 
                   onClick={() => toggleVatMode(false)}
                   className={`relative z-10 flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${!isInputNet ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Brutto
                </button>
                <div 
                    className={`absolute top-1 bottom-1 rounded bg-dg-700 shadow-sm transition-all duration-300 ease-out ${isInputNet ? 'left-1 w-[calc(50%-4px)]' : 'left-[50%] w-[calc(50%-4px)]'}`}
                />
              </div>
            </div>

            <div className="space-y-8">
              <Slider 
                label={`Cena przedmiotu (${isInputNet ? 'Netto' : 'Brutto'})`}
                value={price}
                min={20000}
                max={600000}
                step={1000}
                suffix="PLN"
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Slider 
                  label="Opłata wstępna"
                  value={initialFeePercent}
                  min={0}
                  max={45}
                  step={1}
                  suffix="%"
                  onChange={(e) => setInitialFeePercent(Number(e.target.value))}
                />
                <Slider 
                  label="Wykup końcowy"
                  value={redemptionPercent}
                  min={1}
                  max={30}
                  step={1}
                  suffix="%"
                  onChange={(e) => setRedemptionPercent(Number(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Okres leasingu</label>
                <div className="grid grid-cols-4 gap-3">
                  {[24, 36, 48, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => setPeriod(m)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                        period === m 
                        ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/40 transform scale-105' 
                        : 'bg-dg-900 border-dg-700 text-gray-400 hover:border-gray-500 hover:bg-dg-800'
                      }`}
                    >
                      {m} msc
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tax Settings Area */}
            <div className="mt-8 pt-6 border-t border-dg-700/50">
                <div className="flex items-center gap-2 mb-4 text-green-400 text-xs font-bold uppercase tracking-widest">
                    <PieChart size={14} /> Konfiguracja Podatkowa
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">Stawka PIT/CIT</label>
                        <select 
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            className="w-full bg-dg-900 border border-dg-700 text-white rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all cursor-pointer hover:border-dg-600"
                        >
                            <option value={12}>12% (Ryczałt)</option>
                            <option value={19}>19% (Liniowy/CIT)</option>
                            <option value={32}>32% (Skala II)</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">Płatnik VAT</label>
                         <div className="flex items-center bg-dg-900 rounded-xl p-1 border border-dg-700 h-[46px]">
                            <button onClick={() => setIsVatPayer(true)} className={`flex-1 text-sm font-medium rounded-lg h-full transition-colors ${isVatPayer ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Tak</button>
                            <button onClick={() => setIsVatPayer(false)} className={`flex-1 text-sm font-medium rounded-lg h-full transition-colors ${!isVatPayer ? 'bg-dg-700 text-white' : 'text-gray-400 hover:text-white'}`}>Nie</button>
                        </div>
                    </div>
                </div>
            </div>
          </Card>

          <Card className="border border-white/5 bg-dg-800/30">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Briefcase size={18} className="text-green-500"/>
              Leasing - Informacje
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-green-400 font-semibold mb-1">Czym jest leasing?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Forma finansowania pozwalająca na użytkowanie środka trwałego (pojazdu, maszyny) bez konieczności jego zakupu. Idealny dla przedsiębiorców dzięki korzyściom podatkowym.
                </p>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-green-400 font-semibold mb-2">Warunki leasingu:</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Opłata wstępna:</strong> Zazwyczaj 10-30% wartości przedmiotu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Okres:</strong> Od 24 do 60 miesięcy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Wykup:</strong> 1-20% wartości początkowej po zakończeniu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Korzyści podatkowe:</strong> Raty w koszty + odliczenie VAT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Własność:</strong> U leasingodawcy do wykupu końcowego</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><strong>Dla kogo:</strong> Głównie dla firm (korzyści VAT i CIT)</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

           <ContactForm context={`Leasing: ${price} PLN (${isInputNet ? 'Netto' : 'Brutto'}), ${period} msc`} />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Result */}
          <Card className="bg-gradient-to-br from-dg-800 to-green-900/20 border-green-500/30 shadow-2xl shadow-green-900/10">
             <div className="text-center py-6 border-b border-white/10">
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Rata miesięczna (Netto)</p>
                <div className="text-5xl font-extrabold text-white tracking-tight">
                  {result.monthlyInstallment.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-2xl text-gray-400 font-normal">PLN</span>
                </div>
                <div className="mt-3 inline-block px-3 py-1 rounded bg-white/5 border border-white/5 text-xs text-gray-400">
                    {(result.monthlyInstallment * 1.23).toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN Brutto
                </div>
             </div>

             <div className="p-6 grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <span className="text-xs text-gray-500 uppercase">Wpłata ({initialFeePercent}%)</span>
                 <p className="text-lg font-bold text-white">{result.initialFeeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</p>
               </div>
               <div className="space-y-1 text-right">
                 <span className="text-xs text-gray-500 uppercase">Wykup ({redemptionPercent}%)</span>
                 <p className="text-lg font-bold text-white">{result.redemptionAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</p>
               </div>
               <div className="col-span-2 mt-2 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Suma opłat</span>
                  <span className="text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded">{result.totalSumPercent.toFixed(1)}%</span>
               </div>
             </div>
          </Card>

          {/* Tax Shield Card */}
          <Card className="relative overflow-hidden border border-green-500/20 bg-green-950/20">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck size={80} className="text-green-500" />
              </div>
              
              <h4 className="text-white font-semibold mb-6 flex items-center gap-2 relative z-10">
                  <div className="bg-green-500 rounded p-1">
                    <ShieldCheck size={16} className="text-dg-900" />
                  </div>
                  Tarcza Podatkowa
              </h4>
              
              <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center bg-dg-900/50 p-3 rounded-lg border border-white/5">
                      <span className="text-sm text-gray-400">Oszczędność PIT/CIT</span>
                      <span className="text-green-400 font-bold">-{result.incomeTaxShield.toLocaleString(undefined, {maximumFractionDigits: 0})} PLN</span>
                  </div>
                  {isVatPayer && (
                    <div className="flex justify-between items-center bg-dg-900/50 p-3 rounded-lg border border-white/5">
                        <span className="text-sm text-gray-400">Oszczędność VAT</span>
                        <span className="text-green-400 font-bold">-{result.vatShield.toLocaleString(undefined, {maximumFractionDigits: 0})} PLN</span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                      <div className="flex justify-between items-end">
                          <span className="text-sm text-gray-300">Realny koszt (po podatkach)</span>
                          <div className="text-right">
                              <span className="block text-2xl font-bold text-white">{result.realCost.toLocaleString(undefined, {maximumFractionDigits: 0})} PLN</span>
                          </div>
                      </div>
                      <div className="w-full bg-dg-700 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${(result.realCost / (result.totalLeasingCostNet * 1.23)) * 100}%` }}></div>
                      </div>
                      <p className="text-right text-xs text-gray-500 mt-1">
                          Zaoszczędzasz {(result.totalTaxBenefit).toLocaleString(undefined, {maximumFractionDigits: 0})} PLN
                      </p>
                  </div>
              </div>
          </Card>

          <Card>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Dlaczego warto?</h4>
            <ul className="grid grid-cols-1 gap-3">
              {[
                'Procedura uproszczona (na dowód)',
                'Decyzja w 15 minut online',
                'Leasing od 1 dnia działalności',
                'Możliwość ubezpieczenia GAP'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};