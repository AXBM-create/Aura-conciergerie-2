import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-orange-500/30 animate-bounce">
      <i className="fa-solid fa-circle-check text-brand-orange"></i>
      <span>{message}</span>
    </div>
  );
};
