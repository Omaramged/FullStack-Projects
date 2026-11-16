"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { myBookings } from "@/services/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Calendar } from "lucide-react";
import Link from "next/link";

export default function AttendeeDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<unknown[]>([]);
  useEffect(() => { myBookings().then((r) => setBookings(r.data)).catch(() => {}); }, []);
  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Your upcoming events and tickets.</p>
        </div>
        <Link href="/events"><Button>Browse events</Button></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total bookings</CardTitle><Ticket className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">{bookings.length}</div></CardContent></Card>
        <Card className="border-border/60"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">{(bookings as { status?: string }[]).filter((b) => b.status === "confirmed").length}</div></CardContent></Card>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle>Recent bookings</CardTitle></CardHeader>
        <CardContent>
          {bookings.length === 0 ? <div className="text-center py-8"><p className="text-muted-foreground">No bookings yet.</p><Link href="/events"><Button variant="outline" size="sm" className="mt-2">Browse events</Button></Link></div> : (
            <div className="divide-y">
              {(bookings as { _id: string; eventId?: { title?: string }; status?: string }[]).slice(0, 6).map((b) => (
                <div key={b._id} className="flex items-center justify-between py-3">
                  <p className="font-medium text-sm">{b.eventId?.title ?? "Event"}</p>
                  <Link href={`/bookings/${b._id}`} className="text-xs text-primary hover:underline">View ticket</Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}