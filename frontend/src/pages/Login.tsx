import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { user, loginWithGoogleToken } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      s.onload = initGoogle;
    } else {
      initGoogle();
    }

    function initGoogle() {
      if (!window.google || !window.google.accounts) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            await loginWithGoogleToken(response.credential);
            navigate("/dashboard");
          } catch (err) {
            console.error("Login failed", err);
            alert("Login failed");
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { theme: "outline", size: "large" }
      );
      // window.google.accounts.id.prompt();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Sign in to FlashTalks
        </h2>
        <div id="googleSignInBtn" className="flex justify-center mb-4"></div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Or continue with email (dev only)
        </p>
      </div>
    </div>
  );
}
