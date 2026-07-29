"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getProfile, logoutUser as logoutApi } from "../services/auth";
import { showToast } from "../components/Toast";

interface User {
  username: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          setToken(savedToken);
          const profile = await getProfile();
          setUser(profile);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(username, password);
      const accessToken = data.access_token;
      
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      
      const profile = await getProfile();
      setUser(profile);
      showToast("Signed in successfully!", "success");
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Authentication failed.";
      showToast(msg, "error");
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast("Signed out successfully!", "success");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
