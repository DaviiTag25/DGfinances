import React, { useState, useEffect } from 'react';
import { CalculatorProps, AmortizationRow } from '../types';
import { Button, Card, Input, Slider, Modal } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { ArrowLeft, Table, Home, Percent, Calendar, DollarSign, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const MortgageCalculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [amount, setAmount] = useState(400000);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(7.5);
  const [ownContribution, setOwnContribution] = useState(80000);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const loanAmount = Math.max(0, amount - ownContribution);
    
    if (loanAmount <= 0) {
        setMonthlyPayment(0);
        setTotalInterest(0);
        setTotalCost(0);
        setSchedule([]);
        return;
    }

    // PMT Formula
    const pmt = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = pmt * n;
    
    setMonthlyPayment(pmt);
    setTotalCost(total);
    setTotalInterest(total - loanAmount);

    // Generate Schedule
    const newSchedule: AmortizationRow[] = [];
    let currentBalance = loanAmount;
    
    for (let i = 1; i <= n; i++) {
        const interestPart = currentBalance * r;
        const capitalPart = pmt - interestPart;
        currentBalance -= capitalPart;

        newSchedule.push({
            month: i,
            installment: pmt,
            interestPart: interestPart,
            capitalPart: capitalPart,
            balance: Math.max(0, currentBalance)
        });
    }
    setSchedule(newSchedule);

  }, [amount, years, rate, ownContribution]);

  const loanAmount = Math.max(0, amount - ownContribution);
  const ltv = (loanAmount / amount) * 100;

  const chartData = [
    { name: 'Kapitał', value: loanAmount },
    { name: 'Odsetki', value: totalInterest }
  ];
  const COLORS = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Kredyt Hipoteczny</h2>
          <p className="text-gray-400">Symulacja rat i kosztów zakupu nieruchomości</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-blue-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Home size={20} className="text-blue-500" />
              Parametry Nieruchomości
            </h3>
            
            <div className="space-y-8">
              <Slider 
                label="Wartość nieruchomości"
                value={amount}
                min={100000}
                max={2000000}
                step={5000}
                suffix="PLN"
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <Slider 
                label="Wkład własny"
                value={ownContribution}
                min={0}
                max={amount * 0.9} 
                step={5000}
                suffix="PLN"
                onChange={(e) => setOwnContribution(Number(e.target.value))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-dg-900/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                         <label className="text-sm font-medium text-gray-400">Okres kredytowania</label>
                         <Calendar size={16} className="text-blue-500" />
                      </div>
                      <Slider 
                        label=""
                        value={years}
                        min={5}
                        max={35}
                        step={1}
                        suffix="Lat"
                        onChange={(e) => setYears(Number(e.target.value))}
                      />
                  </div>
                  
                  <div className="bg-dg-900/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                         <label className="text-sm font-medium text-gray-400">Oprocentowanie</label>
                         <Percent size={16} className="text-blue-500" />
                      </div>
                      <Input 
                        label="" 
                        type="number" 
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        suffix="%"
                        className="!mb-0"
                      />
                  </div>
              </div>
            </div>
          </Card>

          <ContactForm context={`Hipoteka: ${loanAmount.toLocaleString()} PLN, ${years} lat`} />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-br from-dg-800 to-blue-900/20 border-blue-500/30 sticky top-6 shadow-2xl shadow-blue-900/10">
            <div className="text-center pb-6 border-b border-white/10">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Twoja miesięczna rata</h3>
                <div className="text-5xl font-extrabold text-white tracking-tight">
                  {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-2xl text-gray-400 font-normal">PLN</span>
                </div>
                <div className="mt-4 flex justify-center gap-3">
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-300">
                        Kwota kredytu: {loanAmount.toLocaleString()} PLN
                    </div>
                     <div className={`px-3 py-1 rounded-full text-xs border ${ltv > 80 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' : 'bg-green-500/10 border-green-500/20 text-green-300'}`}>
                        LTV: {ltv.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-6">
                <div className="p-3 bg-dg-900/50 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Koszt odsetek</p>
                    <p className="text-lg font-bold text-indigo-400">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</p>
                </div>
                <div className="p-3 bg-dg-900/50 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Koszt całkowity</p>
                    <p className="text-lg font-bold text-white">{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    formatter={(value: number) => `${value.toLocaleString()} PLN`}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Icon */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <DollarSign size={24} />
              </div>
            </div>
            
            <Button fullWidth variant="primary" onClick={() => setIsScheduleOpen(true)} className="mt-2">
                <Table className="mr-2" size={18} /> Pokaż Harmonogram
            </Button>
          </Card>
        </div>
      </div>

      {/* Amortization Schedule Modal */}
      <Modal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)}
        title={`Harmonogram spłat (${years} lat)`}
      >
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dg-800 p-4 rounded-xl border border-dg-700">
                    <p className="text-xs text-gray-400 uppercase">Miesięczna Rata</p>
                    <p className="text-2xl font-bold text-white mt-1">{monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})} PLN</p>
                </div>
                <div className="bg-dg-800 p-4 rounded-xl border border-dg-700">
                    <p className="text-xs text-gray-400 uppercase">Kapitał</p>
                    <p className="text-2xl font-bold text-blue-500 mt-1">{loanAmount.toLocaleString()} PLN</p>
                </div>
                <div className="bg-dg-800 p-4 rounded-xl border border-dg-700">
                    <p className="text-xs text-gray-400 uppercase">Odsetki (Koszt)</p>
                    <p className="text-2xl font-bold text-indigo-500 mt-1">{totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})} PLN</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-dg-700">
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-dg-800 sticky top-0 z-10">
                            <tr className="text-gray-400 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-semibold">Nr</th>
                                <th className="py-4 px-4 text-right font-semibold">Rata</th>
                                <th className="py-4 px-4 text-right font-semibold">Odsetki</th>
                                <th className="py-4 px-4 text-right font-semibold">Kapitał</th>
                                <th className="py-4 px-4 text-right font-semibold">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-300 divide-y divide-dg-800">
                            {schedule.map((row) => (
                                <tr key={row.month} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-gray-500">{row.month}</td>
                                    <td className="py-3 px-4 text-right font-medium text-white">{row.installment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="py-3 px-4 text-right text-indigo-400">{row.interestPart.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="py-3 px-4 text-right text-blue-400">{row.capitalPart.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="py-3 px-4 text-right text-gray-500">{row.balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};