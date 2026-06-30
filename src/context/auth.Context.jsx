/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, getMeRequest } from '../api/auth.api';

const AuthContext = createContext();

const TOKEN_KEY = 'token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // loading=true mientras verificamos si hay un token guardado y válido
  const [loading, setLoading] = useState(true);

  // Al montar la app, si hay un token en localStorage, validamos que siga sirviendo
  // pidiendo /auth/me. Esto evita que un token expirado/inválido deje al usuario
  // "logueado" en la UI cuando en realidad el backend ya lo rechazaría.
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);
      } catch {
        // Token inválido o expirado: limpiamos todo
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Si axios detecta un 401 en cualquier request (token expirado/inválido),
  // dispara este evento global para que el estado de React se limpie también,
  // no solo el localStorage. Ver axios.config.js.
  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = async (credentials) => {
    const { token, user: loggedUser } = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (formData) => {
    const { token, user: newUser } = await registerRequest(formData);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}