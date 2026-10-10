import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi } from '../api/endpoints';
import { TOKEN_KEY, extractErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        setUser(data.data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.data.token);
      setUser(data.data.user);
      return data.data.user;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Kirish amalga oshmadi.'));
    }
  }, []);

  const acceptInvite = useCallback(async (payload) => {
    try {
      const { data } = await authApi.acceptInvite(payload);
      localStorage.setItem(TOKEN_KEY, data.data.token);
      setUser(data.data.user);
      return data.data.user;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Taklifni qabul qilib bo\'lmadi.'));
    }
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, logout, acceptInvite, setUser }),
    [user, initializing, login, logout, acceptInvite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak.');
  return ctx;
}
