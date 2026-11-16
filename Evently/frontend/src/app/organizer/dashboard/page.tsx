"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";

// need myEvents service; add to events.ts? Let me inline fetch
import { apiFetch } from "@/services/api";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<unknown[]>([]);
  useEffect(() => { apiFetch<{ success: boolean; data: unknown[] }>("/events/organizer/mine").then((r) => setEvents(r.data)).catch(() => {}); }, []);
  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Organizer dashboard</h1><p className="text-muted-foreground">Welcome, {user?.name}</p></div>
        <div className="flex gap-2">
          <Link href="/organizer/check-in"><Button variant="outline">Check-in</Button></Link>
          <Link href="/organizer/events/new"><Button>Create event</Button></Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total events</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">{events.length}</div></CardContent></Card>
        <Card className="border-border/60"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">{(events as { status?: string }[]).filter((e) => e.status === "published").length}</div></CardContent></Card>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle>My events</CardTitle></CardHeader>
        <CardContent>
          {events.length === 0 ? <div className="text-center py-8"><p className="text-muted-foreground">No events yet.</p><Link href="/organizer/events/new"><Button size="sm" className="mt-2">Create your first event</Button></Link></div> : (
            <div className="divide-y">
              {(events as { _id: string; title: string; status?: string }[]).map((e) => (
                <div key={e._id} className="flex items-center justify-between py-3">
                  <p className="font-medium text-sm">{e.title}</p>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted capitalize">{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}