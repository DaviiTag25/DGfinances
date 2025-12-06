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
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="!px-3 hover:bg-white/5">
          <ArrowLeft size={24} className="text-gray-300" />
        </Button>
      </div>

      {/* Header Section - Tytuł i Podtytuł */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-3 tracking-tight">
          Kredyt Hipoteczny
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Sfinansuj zakup wymarzonego mieszkania lub domu. Oblicz ratę i sprawdź szczegóły oferty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - Opis i Warunki (2/3 szerokości) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Kalkulator - Parametry */}
          <Card className="border-t-4 border-t-blue-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Home size={20} className="text-blue-500" />
              Oblicz swoją ratę
            </h3>
            
            <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                  <Slider 
                    label="Okres kredytowania (lat)"
                    value={years}
                    min={5}
                    max={35}
                    step={1}
                    suffix="lat"
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Oprocentowanie (%)</label>
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

          {/* Opis Oferty */}
          <Card className="border border-blue-500/30 bg-gradient-to-br from-dg-800 to-blue-900/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Home size={24} className="text-blue-500"/>
              O kredycie hipotecznym
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Kredyt hipoteczny to długoterminowe finansowanie zakupu nieruchomości, zabezpieczone hipoteką. 
              Dzięki niemu możesz stać się właścicielem własnego mieszkania lub domu, płacąc wygodne miesięczne raty 
              rozłożone nawet na 35 lat. To najbardziej popularny sposób finansowania nieruchomości w Polsce.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-dg-900/50 p-4 rounded-lg border border-white/10">
                <div className="text-blue-400 font-bold text-2xl mb-1">10-20%</div>
                <div className="text-xs text-gray-400">Minimalny wkład własny</div>
              </div>
              <div className="bg-dg-900/50 p-4 rounded-lg border border-white/10">
                <div className="text-blue-400 font-bold text-2xl mb-1">5-35 lat</div>
                <div className="text-xs text-gray-400">Okres kredytowania</div>
              </div>
              <div className="bg-dg-900/50 p-4 rounded-lg border border-white/10">
                <div className="text-blue-400 font-bold text-2xl mb-1">od 6%</div>
                <div className="text-xs text-gray-400">Oprocentowanie rocznie</div>
              </div>
            </div>
          </Card>

          {/* Warunki Kredytu */}
          <Card className="border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Wallet size={20} className="text-blue-500"/>
              Warunki i wymagania
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-blue-400 font-semibold mb-3 text-sm">✓ Co zyskujesz:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Własne mieszkanie bez konieczności płacenia pełnej kwoty od razu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Długi okres spłaty - niskie miesięczne raty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Możliwość wcześniejszej spłaty bez dodatkowych kosztów</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Konkurencyjne oprocentowanie - najniższe ze wszystkich kredytów</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-3 text-sm">📋 Wymagane dokumenty:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Zaświadczenie o dochodach (PIT, zaświadczenie z pracy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Wycena nieruchomości wykonana przez rzeczoznawcę</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Dokument tożsamości i potwierdzenie adresu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Akt notarialny zakupu (po pozytywnej decyzji)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                <strong>Ważne:</strong> Minimalna zdolność kredytowa i stabilne źródło dochodu są kluczowe dla uzyskania kredytu hipotecznego. 
                Bank weryfikuje Twoją historię kredytową w BIK.
              </p>
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN - Widget z Ratą + Formularz (1/3 szerokości - sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            
            {/* Widget z obliczoną ratą */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500 shadow-2xl shadow-blue-900/30">
              <div className="text-center py-6">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Twoja miesięczna rata</p>
                <div className="text-5xl font-extrabold text-white tracking-tight mb-4">
                  {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-xl text-blue-200 font-normal block mt-1">PLN</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm bg-blue-900/30 px-4 py-2 rounded-lg">
                    <span className="text-blue-200">Kwota kredytu:</span>
                    <span className="text-white font-bold">{loanAmount.toLocaleString()} PLN</span>
                  </div>
                  <div className="flex justify-between text-sm bg-blue-900/30 px-4 py-2 rounded-lg">
                    <span className="text-blue-200">LTV:</span>
                    <span className={`font-bold ${ltv > 80 ? 'text-yellow-300' : 'text-green-300'}`}>{ltv.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm bg-blue-900/30 px-4 py-2 rounded-lg">
                    <span className="text-blue-200">Całkowity koszt:</span>
                    <span className="text-white font-bold">{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} PLN</span>
                  </div>
                </div>

                <Button fullWidth variant="outline" onClick={() => setIsScheduleOpen(true)} className="mt-4 !bg-white !text-blue-600 hover:!bg-blue-50 border-none font-bold">
                  <Table className="mr-2" size={18} /> Zobacz harmonogram
                </Button>
              </div>
            </Card>

            {/* Formularz Kontaktowy */}
            <ContactForm context={`Hipoteka: ${loanAmount.toLocaleString()} PLN, ${years} lat`} />
            
          </div>
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