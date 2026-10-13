"use client";
import { useEffect, useState, use } from "react";

export default function EditLinkPage({ params }) {
  const { id } = use(params);
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/links/" + id, { credentials: "include" })
      .then((res) => res.json().then((d) => ({ ok: res.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.message || "Could not load link");
        setOriginalUrl(d.data.originalUrl);
        setTitle(d.data.title || "");
        setExpiresAt(d.data.expiresAt ? d.data.expiresAt.slice(0, 10) : "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setSaving(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/links/" + id, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, title, expiresAt: expiresAt || null }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Could not update link");
      setOk("Link updated");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  if (loading) return <div className="mx-auto max-w-xl px-4 py-8"><p className="text-slate-500 text-sm">Loading...</p></div>;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 w-full">
      <h1 className="text-2xl font-bold">Edit link</h1>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Destination URL</label>
            <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Expires at</label>
            <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {ok && <p className="text-sm text-green-600">{ok}</p>}
          <button disabled={saving} className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
}
