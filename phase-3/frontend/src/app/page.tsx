/**
 * Home page - Dynamic entry point for the Todo application.
 * Shows ChatGPT-style chat if authenticated, sleeker landing page if not.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatLayout } from "@/components/chat/ChatLayout";
import {
  ArrowRight,
  CheckSquare,
  Zap,
  Shield,
  Layout
} from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");

    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  // Authenticated - Show ChatGPT-style Chat Interface
  if (isAuthenticated) {
    return (
      <div className="h-screen">
        <ChatLayout />
      </div>
    );
  }

  // Not authenticated - Show Sleek Landing Page
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Floating Navbar */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <nav className="flex justify-between items-center bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-foreground">TodoApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="font-semibold shadow-md hover:shadow-lg transition-all">
                Join Now
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20">
              Professional Task Management
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Organize your goals.<br />
            <span className="text-primary">Simplify your life.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and purely minimalist. Built for high-performance individuals who value their time and focus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-2 hover:bg-muted/50">
              View Features
            </Button>
          </div>
        </div>

        {/* Minimal Features Grid (Optional, kept minimal to match "sleek") */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 border-t pt-16">
          <div className="group p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Built for speed with zero lag. Your tasks sync instantly across all devices.</p>
          </div>
          <div className="group p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure by Default</h3>
            <p className="text-muted-foreground">Enterprise-grade encryption keeps your personal data safe and private.</p>
          </div>
          <div className="group p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Layout className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Purely Minimalist</h3>
            <p className="text-muted-foreground">No clutter, no distractions. Just a clean canvas for your thoughts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
