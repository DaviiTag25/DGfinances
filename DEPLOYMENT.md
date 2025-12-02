# DGFinances - Panel Kalkulatorów Finansowych

Panel kalkulatorów finansowych stworzony w Google AI Studio i wdrożony na GitHub Pages.

## 🚀 Funkcjonalności

- Kalkulator kredytu hipotecznego
- Kalkulator leasingu
- Kalkulator zdolności kredytowej
- Kalkulator kredytu samochodowego

## 📦 Deployment na GitHub Pages

Projekt jest automatycznie wdrażany na GitHub Pages przy każdym push do gałęzi `main`.

### Konfiguracja repozytorium GitHub

1. **Włącz GitHub Pages:**
   - Przejdź do Settings → Pages w swoim repozytorium
   - W sekcji "Source" wybierz "GitHub Actions"

2. **Uruchom workflow:**
   - Workflow uruchomi się automatycznie po push do gałęzi `main`
   - Możesz też uruchomić go ręcznie w zakładce Actions

## 🌐 URL strony

Po wdrożeniu, strona będzie dostępna pod adresem:
```
https://daviitag25.github.io/DGfinances/
```

## 🛠️ Lokalne uruchamianie

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Budowanie produkcyjne
npm run build

# Podgląd buildu produkcyjnego
npm run preview
```

## 📝 Struktura projektu

```
DGfinances/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── components/              # Komponenty React
│   ├── ContactForm.tsx
│   ├── UsageGuard.tsx
│   └── ui.tsx
├── views/                   # Widoki kalkulatorów
│   ├── CapacityCalculator.tsx
│   ├── CarLoanCalculator.tsx
│   ├── Home.tsx
│   ├── LeasingCalculator.tsx
│   └── MortgageCalculator.tsx
├── App.tsx                  # Główny komponent aplikacji
├── index.tsx                # Entry point
├── index.html               # HTML template
├── package.json             # Zależności projektu
├── tsconfig.json            # Konfiguracja TypeScript
├── vite.config.ts           # Konfiguracja Vite
└── types.ts                 # Definicje typów TypeScript
```

## 📄 Licencja

Ten projekt jest prywatny.
