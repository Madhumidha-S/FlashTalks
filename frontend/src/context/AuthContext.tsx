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
  logout: () => void;
  requireAuthRedirect: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from token on first render
  useEffect(() => {
    const loadUser = async () => {
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
        console.warn("Invalid or expired token:", err);
        localStorage.removeItem("ft_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ✅ Handle Google login
  const loginWithGoogleToken = async (tokenID: string) => {
    const res = await api.post("/auth/google", { tokenID });
    const { token, user } = res.data;

    if (!token) throw new Error("No token received from backend");

    // 🔐 Save token and set user
    localStorage.setItem("ft_token", token);
    setUser(user);
  };

  // ✅ Logout and redirect
  const logout = () => {
    localStorage.removeItem("ft_token");
    setUser(null);
    window.location.href = "/login";
  };

  // ✅ Redirect helper
  const requireAuthRedirect = () => {
    if (!localStorage.getItem("ft_token")) {
      window.location.href = "/login";
    }
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
