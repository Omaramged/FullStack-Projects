"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getEvent } from "@/services/events";
import { createBooking } from "@/services/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function BookContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<{ event: { title: string }; tickets: { _id: string; name: string; price: number; quantity: number; sold: number }[] } | null>(null);
  const [ticketTypeId, setTicketTypeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    getEvent(id).then((res) => {
      const d = res.data as unknown as { event: { title: string }; tickets: { _id: string; name: string; price: number; quantity: number; sold: number }[] };
      setData(d);
      if (d.tickets.length > 0) setTicketTypeId(d.tickets[0]._id);
    }).catch(() => setData(null));
  }, [id, user, router]);

  const selected = data?.tickets.find((t) => t._id === ticketTypeId);
  const available = selected ? selected.quantity - selected.sold : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTypeId) return;
    setError(""); setLoading(true);
    try {
      const res = await createBooking({ eventId: id, ticketTypeId, quantity });
      const bookingId = (res.data as { booking: { _id: string } }).booking._id;
      router.push(`/bookings/${bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally { setLoading(false); }
  };

  if (!data) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Book tickets</h1>
      <p className="text-muted-foreground">{data.event.title}</p>
      <Card className="border-border/60 shadow-sm">
        <CardHeader><CardTitle>Booking details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Ticket type</Label>
              <Select value={ticketTypeId} onValueChange={(v) => v && setTicketTypeId(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {data.tickets.map((t) => (
                    <SelectItem key={t._id} value={t._id}>{t.name} — {t.price === 0 ? "Free" : `$${t.price}`} ({t.quantity - t.sold} left)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min={1} max={Math.min(available, 10)} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            {selected && (
              <p className="text-sm text-muted-foreground">Total: {selected.price === 0 ? "Free" : `$${selected.price * quantity}`}</p>
            )}
            <p className="text-xs text-muted-foreground">Note: payment is not supported yet; this creates a reservation.</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading || available < 1} className="w-full">
              {loading ? "Booking..." : "Confirm booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading...</div>}>
      <BookContent />
    </Suspense>
  );
}