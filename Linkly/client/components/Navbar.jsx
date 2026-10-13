"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUser(d.data);
      })
      .catch(() => {});
  }, []);

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch {}
  }

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">L</span>
          <span className="font-bold text-xl text-slate-900">Linkly</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how" className="hover:text-blue-600 transition">How it works</a>
          {user && <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {!user && (
            <>
              <Link href="/login" className="text-sm text-slate-700 hover:text-blue-600 transition px-3 py-2">Log in</Link>
              <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign up free</Link>
            </>
          )}
          {user && (
            <>
              <Link href="/dashboard" className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition">Dashboard</Link>
              <button onClick={logout} className="text-sm border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition">Logout</button>
            </>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden border border-slate-200 rounded-lg px-3 py-2 text-slate-700">Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-2 text-sm">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          {!user && (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/register" onClick={() => setOpen(false)}>Sign up free</Link>
            </>
          )}
          {user && <button onClick={logout} className="text-left">Logout</button>}
        </div>
      )}
    </header>
  );
}
