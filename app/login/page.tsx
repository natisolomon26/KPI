// app/login/page.tsx (fixed)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAuthenticated, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isClient, setIsClient] = useState(false);

  // Mark when client-side rendering starts
  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, [checkAuth]);

  // Redirect if already authenticated (only after client-side check)
  useEffect(() => {
    if (isClient && !authLoading && isAuthenticated) {
      console.log('Already authenticated, redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [isClient, authLoading, isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoggingIn(true);
    setErrors({});

    try {
      console.log('Attempting login...');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        // Store token in cookie
        document.cookie = `auth-token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
        // Also store in localStorage as backup
        localStorage.setItem('auth-token', data.token);
        
        // Update auth store
        setUser(data.user);
        setAuthenticated(true);
        
        console.log('Login successful, redirecting to dashboard...');
        
        // Use router.push instead of window.location.href
        router.push('/dashboard');
      } else {
        setErrors({ general: data.error || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Don't render anything until client-side to prevent hydration issues
  if (!isClient) {
    return null;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, don't render the login form (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[120px] mix-blend-multiply" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[140px] mix-blend-multiply" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 bg-white/70 backdrop-blur-2xl rounded-3xl">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] ring-4 ring-white/50">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600 mt-2">Sign in to your admin account</p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@evasue.org"
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
              disabled={isLoggingIn}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-12 py-2 bg-white border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}
                  `}
                  placeholder="Enter your password"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">{errors.general}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoggingIn}
              className="mt-6"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm"
          >
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase text-center mb-3">Demo Credentials</p>
            <div className="space-y-2 text-sm text-slate-700 text-center flex flex-col items-center">
              <div className="bg-white/80 px-4 py-1.5 rounded-lg border border-slate-100 shadow-sm w-full max-w-[250px] flex justify-between items-center">
                <span className="font-medium text-slate-500 text-xs">Email</span>
                <span className="font-mono text-sky-700 font-semibold">admin@evasue.org</span>
              </div>
              <div className="bg-white/80 px-4 py-1.5 rounded-lg border border-slate-100 shadow-sm w-full max-w-[250px] flex justify-between items-center">
                <span className="font-medium text-slate-500 text-xs">Pass</span>
                <span className="font-mono text-sky-700 font-semibold">SecurePassword123</span>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}