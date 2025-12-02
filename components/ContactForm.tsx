import React, { useState } from 'react';
import { Button, Input, Card } from './ui';
import { Send, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react';
import { LeadForm } from '../types';

// ------------------------------------------------------------------
// INSTRUKCJA GOOGLE APPS SCRIPT (BACKEND)
// ------------------------------------------------------------------
// 1. Wejdź na https://docs.google.com/spreadsheets/d/1gLifg2EGmWrOgE2XMolSfpZsvwvUQMmlOEIIYLZmm64/edit
// 2. Kliknij Rozszerzenia -> Apps Script
// 3. Wklej poniższy kod (zastępując wszystko co tam jest):
/*
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // ZABEZPIECZENIE: Sprawdzenie czy skrypt nie jest uruchamiany ręcznie w edytorze
    if (typeof e === 'undefined') {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error", 
        "message": "To nie jest błąd kodu. Uruchomiłeś skrypt ręcznie w edytorze. Ten skrypt działa poprawnie TYLKO gdy dane są wysyłane z formularza na stronie www."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Twój ID arkusza
    var id = "1gLifg2EGmWrOgE2XMolSfpZsvwvUQMmlOEIIYLZmm64";
    var doc = SpreadsheetApp.openById(id);
    var sheet = doc.getSheets()[0];

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name, 
      data.email, 
      data.phone, 
      data.message, 
      data.context
    ]);

    return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
*/
// 4. Kliknij Wdróż (Deploy) -> Zarządzaj wdrożeniami -> Edytuj -> NOWA WERSJA -> Wdróż
// 5. Upewnij się, że "Kto ma dostęp" to "Ktokolwiek" (Anyone)
// ------------------------------------------------------------------

// LINK DO SKRYPTU (WEB APP URL)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_J1tA3HRkQjZZLz5uvH22XjIYpJKqgLCO6PtFYDzQEF_4p7VnGU4ZJCbc3rBfmYL3/exec";

interface ContactFormProps {
  context?: string;
  onSuccess?: () => void;
  variant?: 'default' | 'gatekeeper';
}

export const ContactForm: React.FC<ContactFormProps> = ({ context = 'Ogólny', onSuccess, variant = 'default' }) => {
  const [formData, setFormData] = useState<LeadForm>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<LeadForm>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadForm, boolean>>>({});

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Walidacja
  const validate = (field: keyof LeadForm, value: string): string => {
    switch (field) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Podaj poprawny adres email' : '';
      case 'phone':
        const digits = value.replace(/\D/g, '');
        return digits.length < 9 ? 'Numer telefonu jest za krótki' : '';
      case 'name':
        return value.trim().split(' ').length < 2 ? 'Podaj imię i nazwisko' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof LeadForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: validate(name as keyof LeadForm, value)
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validate(name as keyof LeadForm, value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja przed wysłaniem
    const newErrors = {
      name: validate('name', formData.name),
      email: validate('email', formData.email),
      phone: validate('phone', formData.phone),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
       setErrorMessage("Brak konfiguracji skryptu Google.");
       setStatus('error');
       return;
    }
    
    setStatus('loading');

    try {
      const payload = {
        ...formData,
        context
      };

      await fetch(GOOGLE_SCRIPT_URL as string, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
      });
      
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTouched({});

      // Jeśli przekazano callback onSuccess, wywołaj go po krótkim opóźnieniu (dla efektu wizualnego)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Wystąpił problem z połączeniem. Spróbuj ponownie.');
    }
  };

  if (status === 'success') {
    return (
      <Card className="text-center py-12 animate-in zoom-in-95 fade-in duration-500 bg-gradient-to-br from-dg-800 to-green-900/10 border-green-500/20 relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/50 animate-in zoom-in duration-500 delay-100">
            <CheckCircle size={40} className="text-white drop-shadow-md" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200">Dziękujemy!</h3>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300">
              {variant === 'gatekeeper' 
                ? 'Dostęp do kalkulatorów został odblokowany.' 
                : 'Twój wniosek został wysłany. Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.'}
            </p>
            {variant !== 'gatekeeper' && (
              <Button 
                  variant="outline" 
                  onClick={() => setStatus('idle')}
                  className="animate-in slide-in-from-bottom-2 fade-in duration-500 delay-400 hover:bg-green-500/10 hover:border-green-500 hover:text-green-400"
              >
              Wyślij kolejne zapytanie
              </Button>
            )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${variant === 'gatekeeper' ? 'border-blue-500/50 shadow-2xl shadow-blue-900/50' : ''}`}>
      {variant === 'default' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600" />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className={`text-lg font-semibold ${variant === 'gatekeeper' ? 'text-2xl mb-2' : 'text-white'}`}>
              {variant === 'gatekeeper' ? 'Odblokuj nielimitowany dostęp' : 'Zapytaj o ofertę'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {variant === 'gatekeeper' 
                ? 'Wykorzystałeś limit 3 bezpłatnych kalkulacji. Wypełnij formularz, aby korzystać dalej bez ograniczeń.'
                : 'Nasi eksperci przygotują kalkulację dla Ciebie.'}
            </p>
        </div>
        {!GOOGLE_SCRIPT_URL && (
             <div className="bg-red-500/10 text-red-400 p-2 rounded-lg" title="Brak konfiguracji">
                 <Settings size={20} />
             </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Imię i Nazwisko" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="np. Jan Kowalski"
          error={errors.name}
          disabled={status === 'loading'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Telefon" 
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="np. 500 123 456"
            error={errors.phone}
            disabled={status === 'loading'}
          />
          <Input 
            label="Email" 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="np. jan@firma.pl"
            error={errors.email}
            disabled={status === 'loading'}
          />
        </div>

        {variant === 'default' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Wiadomość (opcjonalnie)</label>
            <textarea 
              name="message"
              rows={3}
              className="w-full bg-dg-900 border border-dg-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Dodatkowe informacje..."
              value={formData.message}
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <AlertCircle size={16} />
            {errorMessage || 'Wystąpił błąd. Sprawdź poprawność danych.'}
          </div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          disabled={status === 'loading'}
          className="relative overflow-hidden group"
          variant={variant === 'gatekeeper' ? 'primary' : 'primary'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Wysyłanie...
            </>
          ) : (
            <>
              {variant === 'gatekeeper' ? 'Odblokuj dostęp' : 'Wyślij zgłoszenie'}
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          Administratorem Twoich danych jest DGFINANCES.
        </p>
      </form>
    </Card>
  );
};