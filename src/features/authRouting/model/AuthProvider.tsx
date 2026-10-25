import { useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { getCurrentUser, loginRequest } from '../api/authApi';
import type { AuthUser } from '../api/authApi';
import { AuthContext } from './AuthContext';

const TOKEN_KEY = 'auth-token';

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  useEffect(() => {
    if (!token || user) {
      return;
    }

    let isCancelled = false;

    getCurrentUser(token)
      .then((profile) => {
        if (!isCancelled) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const newToken = await loginRequest(email, password);
      const profile = await getCurrentUser(newToken);

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
