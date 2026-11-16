import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Ticket, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-24 text-center space-y-6">
          <Badge variant="secondary" className="px-3 py-1">Discover amazing events</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Your next great experience <span className="text-primary">starts here</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Evently helps you discover events, book tickets, and manage reservations — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<Link href="/events" />}>Explore events</Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/register" />}>Create account</Button>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, title: "Discover events", desc: "Browse by category, date, and location." },
            { icon: Ticket, title: "Easy booking", desc: "Book tickets in seconds with QR codes." },
            { icon: Users, title: "Organizer tools", desc: "Create events and manage attendees." },
            { icon: Zap, title: "Instant tickets", desc: "Digital tickets delivered right away." },
          ].map((f) => (
            <Card key={f.title} className="border-border/60 hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}