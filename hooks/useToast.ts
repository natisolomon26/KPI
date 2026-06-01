// hooks/useToast.ts (updated)
import { toast } from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
      icon: '✅',
      style: {
        background: '#10b981',
        color: '#ffffff',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-center',
      icon: '❌',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    dismiss,
  };
};