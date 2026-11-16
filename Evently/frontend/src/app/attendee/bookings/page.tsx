"use client";
import { useEffect, useState } from "react";
import { myBookings, cancelBooking } from "@/services/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => { setLoading(true); myBookings().then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { refresh(); }, []);
  const handleCancel = async (id: string) => { if (!confirm("Cancel this booking?")) return; await cancelBooking(id); refresh(); };
  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
      {loading ? <p>Loading...</p> : bookings.length === 0 ? <p className="text-muted-foreground">No bookings yet.</p> : (
        <div className="grid gap-4">
          {(bookings as { _id: string; eventId?: { title?: string; startDate?: string }; status?: string; quantity?: number }[]).map((b) => (
            <Card key={b._id} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{b.eventId?.title ?? "Event"}</CardTitle>
                <Badge>{b.status}</Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{b.quantity} ticket(s) · {b.eventId?.startDate ? new Date(b.eventId.startDate).toLocaleDateString() : ""}</span>
                <div className="flex gap-2">
                  <Link href={`/bookings/${b._id}`}><Button size="sm" variant="outline">View ticket</Button></Link>
                  {b.status === "confirmed" && <Button size="sm" variant="destructive" onClick={() => handleCancel(b._id)}>Cancel</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}