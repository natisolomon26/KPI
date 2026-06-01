// components/providers/ToastProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#0f172a',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '14px 24px',
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10b981', // Emerald 500
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444', // Red 500
            secondary: '#ffffff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#0ea5e9', // Sky 500
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}