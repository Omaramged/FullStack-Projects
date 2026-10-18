"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SquareTerminal } from "lucide-react";
import { api, getToken, saveToken, saveUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      saveToken(data.token);
      saveUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <SquareTerminal className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Compiler Code</span>
        </Link>

        <div className="mt-6 rounded-xl border border-line bg-surface p-6">
          <h1 className="text-lg font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-ink2">Sign in to open your projects</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3 py-2 text-sm outline-none transition focus:border-accent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3 py-2 text-sm outline-none transition focus:border-accent"
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-ink2">
            No account yet?{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
