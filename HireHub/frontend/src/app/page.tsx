import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Briefcase, Users, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-24 text-center space-y-6">
          <Badge variant="secondary" className="px-3 py-1">Now hiring across industries</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Find your next <span className="text-primary">great hire</span> or <span className="text-primary">great job</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            HireHub connects talented professionals with companies that value them.
            Browse thousands of opportunities or post a job in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<Link href="/jobs" />}>Browse jobs</Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/register" />}>Post a job</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, title: "Smart matching", desc: "Filters for skills, location, experience and salary." },
            { icon: Users, title: "Candidate pipeline", desc: "Track applicants from applied to hired in one place." },
            { icon: Zap, title: "Fast applications", desc: "Apply in seconds with a saved resume." },
            { icon: ShieldCheck, title: "Secure & private", desc: "Resumes and data protected with role-based access." },
          ].map((f) => (
            <Card key={f.title} className="border-border/60 hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-10 text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="opacity-90">Join HireHub today and take the next step in your career or hiring journey.</p>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" size="lg" nativeButton={false} render={<Link href="/register" />}>Create account</Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" nativeButton={false} render={<Link href="/jobs" />}>Explore jobs</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}