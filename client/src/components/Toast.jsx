import { useEffect, useState } from 'react';

let toastListeners = [];

export const toast = {
  show: (message, type = 'success') => {
    toastListeners.forEach(fn => fn({ message, type, id: Date.now() }));
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, 3500);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter(fn => fn !== handler); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-in px-4 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-sm
            ${t.type === 'streak'
              ? 'bg-orange-950/90 border-orange-500/40 text-orange-300'
              : t.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-300'
                : 'bg-zinc-900/90 border-zinc-700 text-white'
            }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}