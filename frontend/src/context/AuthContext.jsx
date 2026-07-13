import { createContext, useContext, useEffect, useState } from "react";
import { mockApi } from "../services/mockApi";
import { authApi } from "../services/api";

const AuthContext = createContext(null);
const SESSION_KEY = "wayfarer_session_v1";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (s) => {
    setSession(s);
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const result = res.data;
    console.log(result);
    persist(result);
    return result;
  };
  
  const register = async (payload) => {
    const res = await authApi.register(payload);
    const result = res.data;
    persist(result);
    return result;
  };

  const logout = () =>{persist(null)};

  const value = {
    session,
    loading,
    isAuthenticated: !!session,
    isAdmin: session?.role === "admin",
    user: session?.user || null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
