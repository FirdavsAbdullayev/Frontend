import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    ({ type = 'info', title, message, duration = 4500 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  // React bo'lmagan kod (masalan, axios interceptor) shu event orqali toast chiqaradi.
  useEffect(() => {
    const onEvent = (e) => {
      if (e.detail) notify(e.detail);
    };
    window.addEventListener('app:toast', onEvent);
    return () => window.removeEventListener('app:toast', onEvent);
  }, [notify]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    },
    []
  );

  const toast = useMemo(
    () => ({
      notify,
      dismiss,
      success: (title, message) => notify({ type: 'success', title, message }),
      error: (title, message) => notify({ type: 'error', title, message, duration: 6000 }),
      info: (title, message) => notify({ type: 'info', title, message }),
      warning: (title, message) => notify({ type: 'warning', title, message, duration: 5500 }),
    }),
    [notify, dismiss]
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast ToastProvider ichida ishlatilishi kerak.');
  return ctx.toast;
}

export function useToastStore() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastStore ToastProvider ichida ishlatilishi kerak.');
  return ctx;
}

/** React bo'lmagan joylardan toast chiqarish uchun yordamchi. */
export const emitToast = (detail) => {
  window.dispatchEvent(new CustomEvent('app:toast', { detail }));
};
