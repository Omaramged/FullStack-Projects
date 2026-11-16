"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => { setLoading(true); apiFetch<{ success: boolean; data: unknown[] }>("/admin/events").then((r) => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { refresh(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete this event?")) return; await apiFetch(`/admin/events/${id}`, { method: "DELETE" }); refresh(); };
  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Events</h1>
      {loading ? <p>Loading...</p> : (
        <Card className="border-border/60"><CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Organizer</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {(events as { _id: string; title: string; status?: string; organizerId?: { name?: string } }[]).map((e) => (
                <TableRow key={e._id}>
                  <TableCell>{e.title}</TableCell><TableCell>{e.organizerId?.name}</TableCell><TableCell>{e.status}</TableCell>
                  <TableCell><Button size="sm" variant="destructive" onClick={() => handleDelete(e._id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}