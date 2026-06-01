// components/AuthInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthInitializer() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication check when the app loads
    checkAuth();
  }, [checkAuth]);

  // This component doesn't render anything visible
  return null;
}