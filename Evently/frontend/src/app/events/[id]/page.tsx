"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getEvent } from "@/services/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EventDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<{ event: Record<string, unknown>; tickets: { _id: string; name: string; description?: string; price: number; quantity: number; sold: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvent(id).then((res) => setData(res.data as never)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>;
  if (!data) return <div className="container mx-auto p-6 text-center text-muted-foreground">Event not found.</div>;

  const ev = data.event as { title: string; description: string; coverImage?: string; category?: string; startDate?: string; startTime?: string; location?: string; meetingLink?: string; eventType?: string; capacity?: number; organizerId?: { name?: string } };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
      <Link href="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to events</Link>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-3">
          {ev.coverImage && <img src={ev.coverImage} alt={ev.title} className="w-full h-56 object-cover rounded-md" />}
          <CardTitle className="text-2xl md:text-3xl">{ev.title}</CardTitle>
          <p className="text-muted-foreground">by {ev.organizerId?.name ?? "Organizer"}</p>
          <div className="flex flex-wrap gap-2">
            {ev.category && <Badge variant="secondary">{ev.category}</Badge>}
            {ev.eventType && <Badge variant="outline">{ev.eventType}</Badge>}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
            {ev.startDate && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(ev.startDate).toLocaleDateString()} {ev.startTime}</span>}
            {ev.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{ev.location}</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h3 className="font-semibold text-lg">About this event</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{ev.description}</p>
          </section>
          {ev.meetingLink && (
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Meeting link</h3>
              <a href={ev.meetingLink} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">{ev.meetingLink}</a>
            </section>
          )}
          <section className="space-y-3">
            <h3 className="font-semibold text-lg">Ticket types</h3>
            {data.tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ticket types available.</p>
            ) : (
              <div className="grid gap-3">
                {data.tickets.map((t) => (
                  <div key={t._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{t.name}</p>
                      {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{t.quantity - t.sold} available</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{t.price === 0 ? "Free" : `$${t.price}`}</p>
                      <Button size="sm" className="mt-2" nativeButton={false} render={<Link href={user?.role === "attendee" ? `/events/${id}/book` : "/login"} />} disabled={user?.role !== "attendee"}>
                        {user?.role === "attendee" ? "Book" : "Sign in to book"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <p className="text-xs text-muted-foreground">Capacity: {ev.capacity}. Note: payment is not supported yet; paid tickets are reservations.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>}>
      <EventDetailContent />
    </Suspense>
  );
}