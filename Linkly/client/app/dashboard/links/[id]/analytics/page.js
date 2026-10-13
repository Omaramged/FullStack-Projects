"use client";
import { useEffect, useState, use } from "react";

export default function LinkAnalyticsPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/links/" + id + "/analytics?range=" + range, { credentials: "include" })
      .then((res) => res.json().then((d) => ({ ok: res.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.message || "Could not load analytics");
        setData(d.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [range, id]);

  function changeRange(e) {
    setRange(e.target.value);
    setData(null);
    setError("");
    setLoading(true);
  }

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8"><p className="text-slate-500 text-sm">Loading analytics...</p></div>;
  if (error) return <div className="mx-auto max-w-4xl px-4 py-8"><p className="text-sm text-red-600">{error}</p></div>;

  const max = Math.max(1, ...data.chart.map((c) => c.clicks));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 w-full">
      <h1 className="text-2xl font-bold">Link analytics</h1>
      <div className="mt-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <a href={data.link.shortUrl} target="_blank" className="text-blue-600 font-medium text-sm break-all hover:underline">{data.link.shortUrl}</a>
        <p className="text-xs text-slate-400 truncate mt-1">{data.link.originalUrl}</p>
        <p className="text-sm mt-2 font-semibold">{data.totalClicks} total clicks</p>
      </div>
      <div className="mt-4 flex gap-2">
        <select value={range} onChange={changeRange} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold">Clicks over time</h2>
        {data.chart.length === 0 && <p className="mt-3 text-sm text-slate-400">No clicks in this period.</p>}
        {data.chart.length > 0 && (
          <div className="mt-4 flex items-end gap-1 h-40">
            {data.chart.map((c) => (
              <div key={c.date} className="flex-1 flex flex-col items-center" title={c.date + ": " + c.clicks}>
                <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition" style={{ height: (c.clicks / max) * 140 + "px", minHeight: "4px" }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold">Recent clicks</h2>
        {data.recentClicks.length === 0 && <p className="mt-3 text-sm text-slate-400">No clicks yet.</p>}
        <div className="mt-3 flex flex-col gap-2">
          {data.recentClicks.map((c) => (
            <div key={c._id} className="text-sm flex flex-col sm:flex-row justify-between gap-1 border-b border-slate-100 pb-2">
              <span>{c.browser} on {c.os} {c.deviceType ? "(" + c.deviceType + ")" : ""}</span>
              <span className="text-xs text-slate-400">{new Date(c.clickedAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
