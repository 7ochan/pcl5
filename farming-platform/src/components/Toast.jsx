import React from 'react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toasts } = useApp();

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyle(toast.type)} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in min-w-64 max-w-md`}
        >
          <span className="text-lg font-bold">{getIcon(toast.type)}</span>
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
