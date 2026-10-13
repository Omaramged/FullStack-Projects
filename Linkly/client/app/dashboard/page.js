"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("7d");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/analytics/overview?range=" + range, { credentials: "include" })
      .then((res) => res.json().then((d) => ({ ok: res.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.message || "Could not load dashboard");
        setData(d.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [range]);

  function changeRange(e) {
    setRange(e.target.value);
    setData(null);
    setError("");
    setLoading(true);
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-slate-500">Loading dashboard...</p></div>;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <Link href="/login" className="inline-block mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">Go to login</Link>
        </div>
      </div>
    );
  }

  const max = Math.max(1, ...data.chart.map((c) => c.clicks));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Your links at a glance.</p>
        </div>
        <div className="flex gap-2">
          <select value={range} onChange={changeRange} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <Link href="/dashboard/links/new" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">New link</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"><p className="text-xs text-slate-500">Total links</p><p className="text-2xl font-bold mt-1">{data.totalLinks}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"><p className="text-xs text-slate-500">Total clicks</p><p className="text-2xl font-bold mt-1">{data.totalClicks}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"><p className="text-xs text-slate-500">Active links</p><p className="text-2xl font-bold mt-1">{data.activeLinks}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"><p className="text-xs text-slate-500">Expired links</p><p className="text-2xl font-bold mt-1">{data.expiredLinks}</p></div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold">Click activity</h2>
          {data.chart.length === 0 && <p className="mt-4 text-sm text-slate-400">No clicks yet. Share a link to see activity.</p>}
          {data.chart.length > 0 && (
            <div className="mt-4 flex items-end gap-1 h-32">
              {data.chart.map((c) => (
                <div key={c.date} className="flex-1 flex flex-col items-center gap-1" title={c.date + ": " + c.clicks}>
                  <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition" style={{ height: (c.clicks / max) * 100 + "px", minHeight: "4px" }}></div>
                </div>
              ))}
            </div>
          )}
          {data.chart.length > 0 && <p className="mt-2 text-xs text-slate-400">{data.chart[0].date} — {data.chart[data.chart.length - 1].date}</p>}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Top links</h2>
            <Link href="/dashboard/links" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {data.topLinks.length === 0 && <p className="mt-4 text-sm text-slate-400">No links yet.</p>}
          <div className="mt-3 flex flex-col gap-2">
            {data.topLinks.map((l) => (
              <div key={l._id} className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl px-3 py-2 hover:bg-slate-50 transition">
                <div className="min-w-0">
                  <a href={l.shortUrl} target="_blank" className="text-sm text-blue-600 font-medium truncate block hover:underline">{l.shortUrl}</a>
                  <p className="text-xs text-slate-400 truncate">{l.originalUrl}</p>
                </div>
                <span className="text-sm font-semibold shrink-0">{l.clickCount} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold">Recent activity</h2>
        {data.recentClicks.length === 0 && <p className="mt-3 text-sm text-slate-400">No recent clicks.</p>}
        <div className="mt-3 flex flex-col gap-2">
          {data.recentClicks.map((c) => (
            <div key={c._id} className="text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
              <span className="text-slate-700 truncate">{c.link ? c.link.shortCode : "link"} — {c.browser} on {c.os}</span>
              <span className="text-xs text-slate-400">{new Date(c.clickedAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
