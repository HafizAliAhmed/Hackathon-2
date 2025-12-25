/**
 * Home page - Dynamic entry point for the Todo application.
 * Shows tasks if authenticated, landing page if not.
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { authApi } from "@/lib/api";
import { Task } from "@/types/task";
import { toast } from "sonner";
import {
  CheckSquare,
  LogOut,
  ListTodo,
  ArrowRight,
  Shield,
  Zap,
  Users
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");

    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
      setIsAuthenticated(false);
      router.refresh();
    } catch {
      authApi.logout();
      setIsAuthenticated(false);
      router.refresh();
    }
  };

  const handleTaskCreated = (_task: Task) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Authenticated - Show Tasks Dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/10">
        {/* Subtle background gradient */}
        <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <CheckSquare className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">
                Todo<span className="text-primary">App</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 rounded-lg text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <ListTodo className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Personal Workspace</h2>
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Manage your objectives for today
              </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="order-2 lg:order-1 space-y-6">
                <TaskList key={refreshTrigger} />
              </div>
              <aside className="order-1 lg:order-2">
                <div className="sticky top-24 space-y-6">
                  <TaskForm onTaskCreated={handleTaskCreated} />

                  {/* Stats/Info card */}
                  <div className="rounded-xl p-5 border bg-card/50 space-y-3">
                    <h3 className="font-bold text-sm flex items-center gap-2 text-primary">
                      <Zap className="h-4 w-4" />
                      Tip of the day
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Small consistent steps lead to big achievements.
                    </p>
                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-lg font-bold">85%</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Focus Score</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated - Show Landing Page
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] right-[-2%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-2%] w-[30%] h-[30%] bg-secondary/5 blur-[80px] rounded-full" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-8">
        <nav className="flex justify-between items-center border border-primary/10 px-6 py-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 group cursor-pointer">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Todo<span className="text-primary">App</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-bold rounded-lg px-6">Join Now</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-extrabold tracking-[0.2em] uppercase border border-primary/10">
            Professional Task Management
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
            Organize your goals. <br />
            <span className="text-gradient">Simplify your life.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
            Fast, secure, and purely minimalistic. Built for high-performance individuals who value their time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 rounded-lg text-sm font-bold gap-2 group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-lg text-sm font-bold">
                View Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Minimalist Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto">
          <div className="p-8 rounded-xl border bg-card/40 transition-colors hover:bg-card/60">
            <Zap className="h-5 w-5 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Instant Flow</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              A clean interface that stays out of your way so you can focus on what matters.
            </p>
          </div>
          <div className="p-8 rounded-xl border bg-card/40 transition-colors hover:bg-card/60">
            <Shield className="h-5 w-5 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Secure Sync</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Your tasks are encrypted and synced across all your devices in real-time.
            </p>
          </div>
          <div className="p-8 rounded-xl border bg-card/40 transition-colors hover:bg-card/60">
            <Users className="h-5 w-5 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Team Access</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Share your progress or collaborate on goals with a simple invite system.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-10 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground text-sm">TodoApp</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} Minimalist Systems</p>
          <div className="flex gap-6 text-[11px] font-bold">
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
