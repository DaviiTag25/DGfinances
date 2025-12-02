export enum View {
  HOME = 'HOME',
  MORTGAGE = 'MORTGAGE',
  LEASING = 'LEASING',
  CAPACITY = 'CAPACITY',
  AUTO = 'AUTO'
}

export interface CalculatorProps {
  onBack: () => void;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalInterest?: number;
  totalCost: number;
  details?: { label: string; value: number }[];
}

export interface LeadForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface AmortizationRow {
  month: number;
  installment: number;
  interestPart: number;
  capitalPart: number;
  balance: number;
}