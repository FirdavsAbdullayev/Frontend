import { useCallback, useEffect, useRef, useState } from 'react';
import { extractErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';

export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fn();
      setData(result);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      if (err?.response?.status !== 401) {
        toastRef.current.notify({ type: 'error', title: 'Xatolik', message });
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run, setData };
}
