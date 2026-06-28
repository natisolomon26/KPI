// components/AuthInitializer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthInitializer() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only check auth once and if not already authenticated
    if (!hasInitialized.current && !isAuthenticated) {
      hasInitialized.current = true;
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  return null;
}