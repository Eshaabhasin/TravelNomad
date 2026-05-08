"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, MapPin, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/app");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    mode === "login" ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-slate-100 selection:bg-emerald-100">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200" style={{ minHeight: 'min(800px, 90vh)' }}>
        {/* --- Left Branding Section --- */}
        <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-10 xl:p-16 overflow-hidden bg-[#064e3b]">
          {/* Abstract Background Decor */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-emerald-400 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-green-500 blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-900/20">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Travel Nomad</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                Adventure is <br />
                <span className="text-emerald-400">waiting for you.</span>
              </h1>
              <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
                Experience the next generation of travel planning. Seamlessly
                integrated with Google Maps and powered by Gemini AI.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 xl:gap-6 mt-8">
            {[
              "AI Itineraries",
              "Smart Routing",
              "Hidden Gems",
              "Live Updates",
            ].map((item, i) => (
              <div key={item} className="flex items-center gap-2 text-emerald-200/90 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Form Section --- */}
        <div className="flex-1 flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 bg-white overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full my-auto">
            <motion.div
              layout
              className="w-full space-y-6 sm:space-y-8"
            >
              {/* Header */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-2 text-slate-500 text-sm sm:text-base">
                  {mode === "login" ? "Please enter your details to sign in." : "Start your journey with us today."}
                </p>
              </div>

              {/* Social Login */}
              <button
                onClick={() => signInWithGoogle()}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-medium tracking-widest">or email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-semibold text-slate-700">Password</label>
                      {mode === "login" && (
                        <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot password?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type={showPw ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "login" ? "Sign In" : "Create Account")}
                </button>
              </form>

              <p className="text-center text-slate-500 text-sm sm:text-base font-medium pt-2">
                {mode === "login" ? "New to Travel Nomad?" : "Already have an account?"}{" "}
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); clearError(); }}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  {mode === "login" ? "Create an account" : "Sign in here"}
                </button>
              </p>
            </motion.div>
          </div>

          <footer className="pt-8 pb-4 text-slate-400 text-xs text-center w-full">
            &copy; 2024 Travel Nomad AI. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}