// context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TbCheck, TbX } from 'react-icons/tb';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const showSuccess = useCallback((message) => addToast(message, 'success'), [addToast]);
  const showError = useCallback((message) => addToast(message, 'error'), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = ({ toasts }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          className={`pointer-events-auto rounded-lg shadow-lg p-4 flex items-start gap-3 border ${
            type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {type === 'success' ? (
            <TbCheck className="mt-0.5 text-green-500" size={20} />
          ) : (
            <TbX className="mt-0.5 text-red-500" size={20} />
          )}
          <span className="text-sm">{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};