"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function Content() {
  const params = useParams();
  const id = params.id as string;
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch<{ success: boolean; data: unknown[] }>(`/organizer/events/${id}/attendees`).then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false)); }, [id]);
  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendees</h1>
      {loading ? <p>Loading...</p> : bookings.length === 0 ? <p className="text-muted-foreground">No bookings yet.</p> : (
        <Card className="border-border/60"><CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Attendee</TableHead><TableHead>Email</TableHead><TableHead>Ticket</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {(bookings as { _id: string; attendeeId?: { name?: string; email?: string }; ticketTypeId?: { name?: string }; quantity?: number; status?: string }[]).map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.attendeeId?.name}</TableCell>
                  <TableCell>{b.attendeeId?.email}</TableCell>
                  <TableCell>{b.ticketTypeId?.name}</TableCell>
                  <TableCell>{b.quantity}</TableCell>
                  <TableCell>{b.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
export default function AttendeesPage() {
  return (<Suspense fallback={<div className="container mx-auto p-6">Loading...</div>}><Content /></Suspense>);
}