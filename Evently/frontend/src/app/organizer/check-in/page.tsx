"use client";
import { useState } from "react";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckInPage() {
  const [ticketCode, setTicketCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(""); setLoading(true);
    try { await apiFetch("/organizer/check-in", { method: "POST", body: JSON.stringify({ ticketCode }) }); setMessage("Checked in successfully."); setTicketCode(""); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className="container mx-auto px-6 py-10 max-w-md space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Check-in</h1>
      <Card className="border-border/60 shadow-sm">
        <CardHeader><CardTitle>Scan or enter ticket code</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="space-y-2"><Label>Ticket code</Label><Input value={ticketCode} onChange={(e) => setTicketCode(e.target.value)} required placeholder="Paste ticket code" /></div>
            {message && <p className="text-sm text-primary font-medium">{message}</p>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Checking..." : "Check in"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}