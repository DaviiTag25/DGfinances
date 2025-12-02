import React, { InputHTMLAttributes, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-dg-800 border border-dg-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 border border-transparent",
    secondary: "bg-dg-700 hover:bg-dg-600 text-white border border-dg-600",
    outline: "bg-transparent border-2 border-dg-700 hover:border-blue-500 text-gray-300 hover:text-white",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, suffix, className = '', ...props }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
    <div className="relative group">
      <input 
        className={`w-full bg-dg-900 border ${error ? 'border-red-500' : 'border-dg-700 group-hover:border-blue-500'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
        {...props}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
    {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
  </div>
);

// --- Slider ---
interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, suffix = '', onChange, ...props }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3 mb-2">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-lg font-bold text-white">{value.toLocaleString()} {suffix}</span>
      </div>
      <div className="relative w-full h-6 flex items-center">
        <div className="absolute w-full h-2 bg-dg-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-100" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        <div 
          className="w-5 h-5 bg-white rounded-full shadow-lg absolute pointer-events-none transition-all duration-100"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-dg-900 border border-dg-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dg-700">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-dg-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};