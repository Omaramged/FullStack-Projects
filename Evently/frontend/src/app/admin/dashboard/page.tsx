"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ users: number; events: number; bookings: number } | null>(null);
  useEffect(() => { apiFetch<{ success: boolean; data: { users: number; events: number; bookings: number } }>("/admin/stats").then((r) => setStats(r.data)).catch(() => {}); }, []);
  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60"><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.users ?? "—"}</div><Link href="/admin/users" className="text-sm text-primary hover:underline">Manage</Link></CardContent></Card>
        <Card className="border-border/60"><CardHeader><CardTitle>Events</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.events ?? "—"}</div><Link href="/admin/events" className="text-sm text-primary hover:underline">Manage</Link></CardContent></Card>
        <Card className="border-border/60"><CardHeader><CardTitle>Bookings</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.bookings ?? "—"}</div></CardContent></Card>
      </div>
    </div>
  );
}