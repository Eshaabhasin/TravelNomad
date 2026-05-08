"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleError = (e: unknown) => {
    const code = (e as { code?: string }).code ?? "";
    const map: Record<string, string> = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/email-already-in-use": "Email already in use.",
      "auth/invalid-email": "Invalid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/popup-closed-by-user": "Sign-in popup was closed.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/configuration-not-found": "Firebase not configured yet. Add your Firebase keys to .env.local.",
    };
    setError(map[code] ?? "Authentication failed. Try again.");
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      // Check if Firebase is configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key') {
        setError("Firebase not configured. Add your Firebase keys to .env.local to enable login.");
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (e) { handleError(e); }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { handleError(e); }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) { handleError(e); }
  };

  const logout = async () => {
    try { await signOut(auth); } catch (e) { handleError(e); }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
