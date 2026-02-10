"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Loader2, Mail } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAuth = async (isSignup: boolean) => {
    setLoading(true);
    setMessage(null);
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = isSignup ? await signup(formData) : await login(formData);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (isSignup) {
      setMessage({ type: 'success', text: "Check your email to confirm the signup!" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 justify-center items-center">
      <div className="w-full max-w-sm space-y-8 text-center">
        <Logo className="justify-center" />
        
        <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Login or create your account</p>
        </div>

        <div className="space-y-4 text-left">
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 outline-none"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 outline-none"
                    required
                />
            </div>
            
            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-3">
                <Button 
                    className="w-full h-12 font-bold text-lg" 
                    onClick={() => handleAuth(false)}
                    disabled={loading || !email || !password}
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Log In"}
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full h-12 font-bold"
                    onClick={() => handleAuth(true)}
                    disabled={loading || !email || !password}
                >
                    Create Account
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
