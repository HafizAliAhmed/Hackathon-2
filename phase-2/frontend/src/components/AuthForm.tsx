/**
 * Reusable authentication form component.
 * Handles both login and registration with validation.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Mail, Lock, AlertCircle, CheckSquare } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const isLogin = mode === "login";

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await authApi.login({ email, password });
        toast.success("Logged in successfully!");
      } else {
        await authApi.register({ email, password });
        toast.success("Account created successfully!");
      }

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const detail = error.data?.detail || error.statusText;
        setErrors({ general: detail });
        toast.error(detail);
      } else {
        setErrors({ general: "An unexpected error occurred" });
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Very subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <Card className="w-full max-w-md border border-border shadow-md rounded-xl overflow-hidden bg-card">
        <CardHeader className="space-y-3 pt-10 pb-8 text-center border-b bg-muted/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Todo<span className="text-primary">App</span></span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              {mode === "login"
                ? "Enter your credentials"
                : "Join our professional workspace"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 rounded-lg border-input bg-background/50 focus:bg-background transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 rounded-lg border-input bg-background/50 focus:bg-background transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="font-bold">{errors.general}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Working...</span>
                </div>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <CardFooter className="flex flex-col space-y-4 px-0 pb-0 pt-6 mt-6 border-t">
            <div className="text-xs text-center font-bold uppercase tracking-wider">
              <span className="text-muted-foreground">
                {mode === "login"
                  ? "New here?"
                  : "Already a member?"}{" "}
              </span>
              <Link
                href={mode === "login" ? "/register" : "/login"}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {mode === "login" ? "Register" : "Sign in"}
              </Link>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
