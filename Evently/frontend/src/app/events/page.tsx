"use client";
import { useEffect, useState } from "react";
import { listEvents, type Event } from "@/services/events";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await listEvents({ search, category, page, limit: 12 });
      setEvents(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchEvents(); }, [page]);

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover events</h1>
        <p className="text-muted-foreground">Find experiences near you.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border bg-card shadow-sm">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="relative flex-1"><Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
        <Button onClick={() => { setPage(1); fetchEvents(); }} className="sm:w-32">Search</Button>
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-48 animate-pulse bg-muted/40" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No events found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Card key={ev._id} className="group hover:shadow-lg hover:-translate-y-0.5 transition-all border-border/60">
              <CardHeader className="space-y-1">
                {ev.coverImage && <img src={ev.coverImage} alt={ev.title} className="w-full h-40 object-cover rounded-md mb-2" />}
                <CardTitle className="text-lg group-hover:text-primary transition-colors"><Link href={`/events/${ev._id}`}>{ev.title}</Link></CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{ev.startDate ? new Date(ev.startDate).toLocaleDateString() : ""} {ev.startTime}</p>
                {ev.location && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ev.location}</p>}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {ev.category && <Badge variant="secondary" className="text-xs">{ev.category}</Badge>}
                {ev.eventType && <Badge variant="outline" className="text-xs">{ev.eventType}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-3 pt-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}