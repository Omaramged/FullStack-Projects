"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showDelete, setShowDelete] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    load();
  }, [page, sort, status]);

  async function load(term) {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ page, limit: 10, sort, status, search: term !== undefined ? term : search });
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links?" + q.toString(), { credentials: "include" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Could not load links");
      setLinks(d.data.links);
      setPages(d.data.pages);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function doSearch(e) {
    e.preventDefault();
    setPage(1);
    load(search);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  async function toggle(id, current) {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links/" + id + "/status", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links/" + id, { method: "DELETE", credentials: "include" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setShowDelete(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My links</h1>
        <Link href="/dashboard/links/new" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center">New link</Link>
      </div>

      <form onSubmit={doSearch} className="mt-4 flex flex-col md:flex-row gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, URL or code..." className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="clicks">Most clicks</option>
        </select>
        <button className="text-sm border border-slate-200 rounded-lg px-4 py-2 bg-white hover:bg-slate-50 transition">Search</button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-slate-500 text-sm">Loading links...</p>}
      {!loading && links.length === 0 && (
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="font-semibold">No links found</p>
          <p className="text-sm text-slate-500 mt-1">Create your first short link to get started.</p>
          <Link href="/dashboard/links/new" className="inline-block mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">Create link</Link>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {links.map((l) => (
          <div key={l._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={l.shortUrl} target="_blank" className="text-blue-600 font-medium text-sm break-all hover:underline">{l.shortUrl}</a>
                  {!l.isActive && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactive</span>}
                  {l.isActive && !l.expired && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>}
                  {l.expired && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Expired</span>}
                </div>
                <p className="text-xs text-slate-400 truncate mt-1">{l.originalUrl}</p>
                <p className="text-xs text-slate-400 mt-1">{l.clickCount} clicks {l.title ? "— " + l.title : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button onClick={() => copy(l.shortUrl)} className="border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">{copied === l.shortUrl ? "Copied!" : "Copy"}</button>
                <a href={l.originalUrl} target="_blank" className="border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">Open</a>
                <Link href={"/dashboard/links/" + l._id + "/analytics"} className="border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">Stats</Link>
                <Link href={"/dashboard/links/" + l._id + "/edit"} className="border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">Edit</Link>
                <button onClick={() => toggle(l._id, l.isActive)} className="border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">{l.isActive ? "Deactivate" : "Activate"}</button>
                <button onClick={() => setShowDelete(l)} className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100 transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border border-slate-200 rounded-lg px-3 py-1.5 bg-white disabled:opacity-40">Prev</button>
          <span className="text-slate-500">Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="border border-slate-200 rounded-lg px-3 py-1.5 bg-white disabled:opacity-40">Next</button>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold">Delete this link?</h3>
            <p className="text-sm text-slate-500 mt-2 break-all">{showDelete.shortUrl}</p>
            <p className="text-sm text-slate-500 mt-1">This will also delete its click history. This cannot be undone.</p>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowDelete(null)} className="text-sm border border-slate-200 rounded-lg px-4 py-2">Cancel</button>
              <button onClick={() => remove(showDelete._id)} className="text-sm bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
