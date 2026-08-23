import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './index.css';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#0f172a',
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
            colorInputBackground: '#1e293b',
            colorInputText: '#f8fafc',
            borderRadius: '0.85rem',
          },
          elements: {
            card: 'bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6',
            headerTitle: 'text-slate-100 font-extrabold text-xl',
            headerSubtitle: 'text-slate-400 text-xs',
            socialButtonsBlockButton: 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 transition-all',
            formButtonPrimary: 'bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/25',
            footerActionLink: 'text-indigo-400 hover:text-indigo-300 font-semibold',
            userButtonPopoverCard: 'bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl rounded-2xl',
            userButtonPopoverActionButtonIcon: 'text-slate-300',
            userButtonPopoverActionButtonText: 'text-slate-100 font-medium',
            userPreviewSecondaryIdentifier: 'text-slate-300',
            badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);
