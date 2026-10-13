"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUser(d.data);
          setName(d.data.name);
        }
      })
      .catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Could not update profile");
      setUser(d.data);
      setMsg("Profile updated");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 w-full">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {!user && <p className="text-sm text-slate-500">Loading...</p>}
        {user && (
          <div className="flex flex-col gap-3 text-sm">
            <div><p className="text-slate-500">Username</p><p className="font-medium">{user.username}</p></div>
            <div><p className="text-slate-500">Email</p><p className="font-medium">{user.email}</p></div>
            <form onSubmit={save} className="flex flex-col gap-2 mt-2">
              <label className="font-medium">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              {msg && <p className="text-sm text-green-600">{msg}</p>}
              <button disabled={saving} className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
            </form>
            <p className="text-xs text-slate-400 mt-2">Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
