import React, { useState, useEffect } from 'react';
import { ContactForm } from './ContactForm';
import { Lock } from 'lucide-react';

const FREE_USAGE_LIMIT = 3;
const STORAGE_KEY_COUNT = 'dg_calc_usage_count';
const STORAGE_KEY_UNLOCKED = 'dg_calc_unlocked';

interface UsageGuardProps {
  children: React.ReactNode;
}

export const UsageGuard: React.FC<UsageGuardProps> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // 1. Check if already unlocked permanently
      const isUnlocked = localStorage.getItem(STORAGE_KEY_UNLOCKED) === 'true';
      if (isUnlocked) {
        setIsChecking(false);
        return;
      }

      // 2. Get current count
      const currentCount = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
      
      // 3. Logic: If we are entering this view, we increment interaction count.
      // This counts as "1 calculation attempt" (viewing/using the calculator)
      const newCount = currentCount + 1;
      
      localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());

      // 4. Check if limit exceeded
      // If previous count was 3, now it's 4 -> Lock it.
      if (newCount > FREE_USAGE_LIMIT) {
        setIsLocked(true);
      }
      
      setIsChecking(false);
    };

    checkAccess();
  }, []);

  const handleUnlock = () => {
    localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
    // Add a small delay for animation purposes handled by ContactForm, then unlock
    setTimeout(() => {
        setIsLocked(false);
    }, 500);
  };

  if (isChecking) return null; // Or a spinner

  return (
    <div className="relative min-h-[600px]">
      {/* Content */}
      <div className={`transition-all duration-500 ${isLocked ? 'blur-xl opacity-40 pointer-events-none select-none' : ''}`}>
        {children}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-700">
          <div className="max-w-md w-full relative">
            {/* Decoration Icon */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-dg-900 rounded-full flex items-center justify-center border-4 border-dg-800 shadow-2xl z-0">
               <div className="bg-blue-600/20 p-4 rounded-full">
                  <Lock size={32} className="text-blue-500" />
               </div>
            </div>
            
            <div className="relative z-10 pt-8">
               <ContactForm 
                  variant="gatekeeper" 
                  context="Odblokowanie limitu kalkulatora" 
                  onSuccess={handleUnlock} 
               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};