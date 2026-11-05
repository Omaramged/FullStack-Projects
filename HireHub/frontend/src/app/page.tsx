import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">HireHub</h1>
      <p className="max-w-xl text-muted-foreground">
        A modern job recruitment platform connecting employers with job seekers.
        Find jobs, apply, and manage your recruitment process.
      </p>
      <div className="flex gap-3">
        <Button render={<Link href="/jobs" />}>Browse Jobs</Button>
        <Button variant="outline" render={<Link href="/login" />}>
          Sign In
        </Button>
      </div>
    </main>
  );
}