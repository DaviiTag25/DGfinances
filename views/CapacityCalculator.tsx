import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { Button, Card, Input, Slider } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, TrendingUp, Users, Wallet, CreditCard, Banknote, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const CapacityCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [income, setIncome] = useState(6500);
  const [householdSize, setHouseholdSize] = useState(1);
  const [limits, setLimits] = useState(500); 
  const [installments, setInstallments] = useState(0); 

  // Calculations
  const costOfLiving = 1200 + ((householdSize - 1) * 800);
  const totalMonthlyCosts = costOfLiving + limits + installments;
  const disposableIncome = Math.max(0, income - totalMonthlyCosts);
  const maxInstallment = Math.max(0, disposableIncome * 0.65);
  const estimatedCapacity = maxInstallment * 110;

  const data = [
    { name: 'Dochód', value: income, color: '#22c55e', label: 'Przychody' },
    { name: 'Koszty', value: totalMonthlyCosts, color: '#ef4444', label: 'Obciążenia' },
    { name: 'Wolne', value: disposableIncome, color: '#3b82f6', label: 'Dostępne' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Zdolność Kredytowa</h2>
          <p className="text-gray-400">Analiza Twojego budżetu i potencjału kredytowego</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-t-4 border-t-purple-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Wallet size={20} className="text-purple-500" />
              Twoje Finanse
            </h3>
            
            <div className="space-y-8">
              <div className="bg-dg-900/50 p-5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-bold uppercase">
                      <Banknote size={16} /> Przychody
                  </div>
                  <Slider 
                    label="Dochód Netto (na rękę)"
                    value={income}
                    min={2000}
                    max={50000}
                    step={100}
                    suffix="PLN"
                    onChange={(e) => setIncome(Number(e.target.value))}
                  />
              </div>

              <div className="bg-dg-900/50 p-5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-2 mb-4 text-red-400 text-sm font-bold uppercase">
                      <CreditCard size={16} /> Obciążenia
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Gospodarstwo domowe</label>
                        <div className="flex gap-2">
                            {[1,2,3,4,5].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setHouseholdSize(n)}
                                    className={`flex-1 h-10 rounded-lg flex items-center justify-center font-bold transition-all border ${
                                        householdSize === n 
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40' 
                                        : 'bg-dg-800 border-dg-700 text-gray-500 hover:text-white hover:bg-dg-700'
                                    }`}
                                >
                                    <span className="flex items-center gap-1">
                                        {n} <Users size={12} />
                                    </span>
                                </button>
                            ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <Input 
                            label="Raty kredytów"
                            type="number"
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            suffix="PLN"
                          />
                          <Input 
                            label="Limity na kartach"
                            type="number"
                            value={limits}
                            onChange={(e) => setLimits(Number(e.target.value))}
                            suffix="PLN"
                          />
                     </div>
                  </div>
              </div>
            </div>
          </Card>
          
           <ContactForm context={`Zdolność: dochód ${income}, gospodarstwo ${householdSize} os.`} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-gradient-to-br from-dg-800 to-purple-900/20 border-purple-500/30 text-center py-12 relative overflow-hidden shadow-2xl shadow-purple-900/10">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6 text-purple-400 ring-1 ring-purple-500/20">
                <TrendingUp size={32} />
            </div>
            
            <h3 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-2">Szacowana maksymalna kwota</h3>
            
            <div className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tighter drop-shadow-lg">
                {estimatedCapacity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className="text-3xl text-gray-500 ml-2 font-light">PLN</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                 <div className="bg-dg-900/80 px-4 py-2 rounded-full border border-white/5 text-sm text-gray-300">
                    Maksymalna bezpieczna rata: <span className="text-white font-bold">{maxInstallment.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                </div>
                 <p className="text-xs text-gray-500 max-w-sm px-4">
                    Wyliczenie oparte na wskaźniku DTI (Debt to Income) na poziomie 65%. 
                </p>
            </div>
          </Card>

          <Card className="min-h-[300px] flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm text-white font-bold uppercase tracking-wider flex items-center gap-2">
                    <PieChart size={16} className="text-gray-400"/> Analiza Budżetu
                </h4>
             </div>
             
             <div className="flex-grow">
                 <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }} barSize={32} barGap={8}>
                        <XAxis type="number" hide />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} 
                            width={80} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.03)'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                            formatter={(value: number) => `${value.toLocaleString()} PLN`}
                        />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} background={{ fill: '#1e293b', radius: [0,6,6,0] }}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
             </div>
             
             <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500 border-t border-white/5 pt-4">
                 <div>
                     <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                     Przychody
                 </div>
                 <div>
                     <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                     Koszty
                 </div>
                 <div>
                     <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                     Wolne środki
                 </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};