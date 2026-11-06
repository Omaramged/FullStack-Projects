"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-lg">HireHub</Link>
        <nav className="flex items-center gap-3">
          <Link href="/jobs" className="text-sm hover:underline">Jobs</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
              <Link href="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}