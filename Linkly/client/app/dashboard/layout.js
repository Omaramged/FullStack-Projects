import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 w-full">
      <nav className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap gap-2 text-sm shadow-sm">
        <Link href="/dashboard" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">Overview</Link>
        <Link href="/dashboard/links" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">Links</Link>
        <Link href="/dashboard/links/new" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">New link</Link>
        <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">Settings</Link>
        <Link href="/" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition ml-auto">Home</Link>
      </nav>
      {children}
    </div>
  );
}
