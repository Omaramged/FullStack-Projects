"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { getBooking } from "@/services/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

function BookingDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{ booking: { _id: string; bookingCode: string; status: string; quantity: number; totalPrice: number; eventId?: { title?: string; startDate?: string; startTime?: string; location?: string } }; tickets: { _id: string; ticketCode: string; qrCode: string; checkedIn: boolean }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(id).then((res) => setData(res.data as never)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>;
  if (!data) return <div className="container mx-auto p-6 text-center text-muted-foreground">Booking not found.</div>;

  const { booking, tickets } = data;
  const ev = booking.eventId as { title?: string; startDate?: string; startTime?: string; location?: string } | undefined;

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl space-y-6">
      <Link href="/attendee/bookings" className="text-sm text-muted-foreground hover:text-foreground">← My bookings</Link>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{ev?.title ?? "Event"}</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {ev?.startDate && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(ev.startDate).toLocaleDateString()} {ev.startTime}</span>}
            {ev?.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{ev.location}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Badge>{booking.status}</Badge>
            <span className="text-sm text-muted-foreground">Code: {booking.bookingCode}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm">Quantity: {booking.quantity} · Total: ${booking.totalPrice}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tickets.map((t) => (
              <Card key={t._id} className="border-border/60">
                <CardContent className="p-4 text-center space-y-2">
                  <img src={t.qrCode} alt="QR" className="mx-auto w-40 h-40" />
                  <p className="text-xs font-mono text-muted-foreground">{t.ticketCode}</p>
                  {t.checkedIn && <Badge variant="secondary">Checked in</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>}>
      <BookingDetailContent />
    </Suspense>
  );
}