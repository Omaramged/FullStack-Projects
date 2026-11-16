"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { deleteEvent } from "@/services/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => { setLoading(true); apiFetch<{ success: boolean; data: unknown[] }>("/events/organizer/mine").then((r) => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { refresh(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete this event?")) return; await deleteEvent(id); refresh(); };
  const handlePublish = async (id: string, status: string) => { await (await import("@/services/events")).updateEvent(id, { status }); refresh(); };
  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My events</h1>
        <Link href="/organizer/events/new"><Button>Create event</Button></Link>
      </div>
      {loading ? <p>Loading...</p> : events.length === 0 ? <p className="text-muted-foreground">No events yet.</p> : (
        <div className="grid gap-4">
          {(events as { _id: string; title: string; status?: string }[]).map((e) => (
            <Card key={e._id} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <Badge>{e.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Link href={`/organizer/events/${e._id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
                <Link href={`/organizer/events/${e._id}/attendees`}><Button size="sm" variant="outline">Attendees</Button></Link>
                {e.status === "draft" && <Button size="sm" onClick={() => handlePublish(e._id, "published")}>Publish</Button>}
                {e.status === "published" && <Button size="sm" variant="outline" onClick={() => handlePublish(e._id, "cancelled")}>Cancel event</Button>}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(e._id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}