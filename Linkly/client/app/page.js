"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function shorten(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!url) {
      setError("Please paste a URL first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not shorten link");
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => setError("Copy failed, please copy manually")
    );
  }

  return (
    <main>
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 text-center">
          <span className="inline-block text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">Simple links, real analytics</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Shorten links, track every click</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto md:text-lg">Linkly turns long messy URLs into short links you can share anywhere, then shows you exactly how they perform.</p>
          <form onSubmit={shorten} className="mt-8 mx-auto max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 shadow-sm">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here, e.g. https://example.com/very/long/page"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button disabled={loading} className="bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {result && (
            <div className="mt-4 mx-auto max-w-2xl bg-white border border-green-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-500">Your short link</p>
                <a href={result.shortUrl} target="_blank" className="text-blue-600 font-medium break-all hover:underline">{result.shortUrl}</a>
                <p className="text-xs text-slate-400 truncate mt-1">{result.originalUrl}</p>
              </div>
              <button onClick={copy} className="text-sm border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition">{copied ? "Copied!" : "Copy"}</button>
              <a href={result.shortUrl} target="_blank" className="text-sm bg-slate-900 text-white rounded-lg px-4 py-2 hover:bg-slate-700 transition">Open</a>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">No signup needed to try it. Free forever for basic links.</p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div><p className="text-2xl font-bold text-slate-900">10k+</p><p className="text-slate-500">Links shortened</p></div>
            <div><p className="text-2xl font-bold text-slate-900">98%</p><p className="text-slate-500">Uptime</p></div>
            <div><p className="text-2xl font-bold text-slate-900">Real</p><p className="text-slate-500">Click tracking</p></div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Everything you need for links</h2>
        <p className="text-center text-slate-600 mt-2">Shorten, manage and measure in one place.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">S</div>
            <h3 className="mt-4 font-semibold">Fast shortening</h3>
            <p className="mt-2 text-sm text-slate-600">Paste any http or https link and get a short URL instantly, with optional custom alias.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">C</div>
            <h3 className="mt-4 font-semibold">Click analytics</h3>
            <p className="mt-2 text-sm text-slate-600">See total clicks, daily activity, top links and recent visits from real data.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">M</div>
            <h3 className="mt-4 font-semibold">Full control</h3>
            <p className="mt-2 text-sm text-slate-600">Edit destinations, set expiry dates, activate or deactivate links anytime.</p>
          </div>
        </div>
      </section>

      <section id="how" className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold text-center">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="text-center p-6">
              <p className="text-sm font-bold text-blue-600">STEP 1</p>
              <h3 className="mt-2 font-semibold">Paste your URL</h3>
              <p className="mt-2 text-sm text-slate-600">Copy any long link from your browser.</p>
            </div>
            <div className="text-center p-6">
              <p className="text-sm font-bold text-blue-600">STEP 2</p>
              <h3 className="mt-2 font-semibold">Get a short link</h3>
              <p className="mt-2 text-sm text-slate-600">Linkly creates a short URL you can share.</p>
            </div>
            <div className="text-center p-6">
              <p className="text-sm font-bold text-blue-600">STEP 3</p>
              <h3 className="mt-2 font-semibold">Track clicks</h3>
              <p className="mt-2 text-sm text-slate-600">Watch visits appear on your dashboard.</p>
            </div>
          </div>
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition">Create free account</Link>
            <Link href="/login" className="border border-slate-200 text-sm font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition">Log in</Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">L</span>
          <span className="font-semibold text-slate-900">Linkly</span>
          <span>© 2026</span>
        </div>
        <div className="flex gap-5">
          <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
          <Link href="/register" className="hover:text-blue-600 transition">Register</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
          <Link href="/terms" className="hover:text-blue-600 transition">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
