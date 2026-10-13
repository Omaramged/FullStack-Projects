"use client";
import { useState } from "react";

export default function NewLinkPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone(null);
    if (!originalUrl) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, title, customAlias, expiresAt: expiresAt || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create link");
      setDone(data.data);
      setOriginalUrl("");
      setTitle("");
      setCustomAlias("");
      setExpiresAt("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 w-full">
      <h1 className="text-2xl font-bold">Create link</h1>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Destination URL *</label>
            <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://example.com/page" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My campaign link" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Custom alias (optional)</label>
            <input value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-alias" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Expires at (optional)</label>
            <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {done && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700">Link created!</p>
              <a href={done.shortUrl} target="_blank" className="text-sm text-blue-600 font-medium break-all hover:underline">{done.shortUrl}</a>
            </div>
          )}
          <button disabled={loading} className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">{loading ? "Creating..." : "Create short link"}</button>
        </form>
      </div>
    </div>
  );
}
