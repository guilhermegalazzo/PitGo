"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = isSignup ? await signup(formData) : await login(formData);

      if (result && 'error' in result) {
        setMessage({ type: 'error', text: result.error as string });
        setLoading(false);
      } else if (isSignup) {
        setMessage({ type: 'success', text: "Verification email sent! Please check your inbox." });
        setLoading(false);
      }
      // Successful login redirects automatically via server action
    } catch (err: any) {
      console.error("Auth Exception:", err);
      setMessage({ type: 'error', text: "Connection failure. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D1F] text-foreground p-6 justify-center items-center relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -rotate-12" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md p-8 glass rounded-[3rem] mechanical-shadow relative z-10 border border-white/5">
        <div className="flex flex-col items-center mb-10">
            <Logo className="mb-8 scale-110" />
            <h1 className="text-3xl font-black italic tracking-tighter uppercase gradient-text leading-none">
                {isSignup ? "Join the Fleet" : "Ready to Roll"}
            </h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-3">
                {isSignup ? "Create your driver or customer account" : "Access your PITGO dashboard"}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold transition-all"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Access Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold transition-all"
                        required
                    />
                </div>
            </div>
            
            {message && (
                <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 border ${
                    message.type === 'error' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                    {message.text}
                </div>
            )}

            <Button 
                type="submit"
                className="w-full h-16 font-black italic uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-primary/30 group" 
                disabled={loading || !email || !password}
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                        {isSignup ? "Ignition / Sign Up" : "Full Throttle / Login"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </Button>
            
            <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                <button 
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                >
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Create one"}
                </button>
                <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
                    <ShieldCheck className="h-3 w-3" /> Secure Auth by Supabase
                </div>
            </div>
        </form>
      </div>
    </div>
  );
}
