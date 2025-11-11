import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithGoogleToken: (tokenID: string) => Promise<void>;
  logout: () => Promise<void>;
  requireAuthRedirect: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loadUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("ft_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.warn("Invalid token or failed to fetch profile", err);
      localStorage.removeItem("ft_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loginWithGoogleToken = async (tokenID: string) => {
    const res = await api.post("/auth/google", { tokenID });
    const { token, user } = res.data;
    if (token) {
      localStorage.setItem("ft_token", token);
      setUser(user);
    } else {
      throw new Error("No token received");
    }
  };

  const logout = async () => {
    localStorage.removeItem("ft_token");
    setUser(null);
    // await api.post('/auth/logout');
  };

  const requireAuthRedirect = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogleToken,
        logout,
        requireAuthRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
