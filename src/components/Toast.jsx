import { useEffect, useState, useCallback } from 'react';

let toastId = 0;

// Global event bus so any component can trigger a toast
const listeners = new Set();

function emit(toast) {
  listeners.forEach((fn) => fn(toast));
}

export function showToast(message, type = 'success') {
  emit({ id: ++toastId, message, type });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3500);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => listeners.delete(addToast);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
