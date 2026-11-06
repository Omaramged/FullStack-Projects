"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { myJobs } from "@/services/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<unknown[]>([]);

  useEffect(() => {
    myJobs().then((r) => setJobs(r.data)).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total jobs</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{jobs.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active jobs</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {(jobs as { status?: string }[]).filter((j) => j.status === "published").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Company</CardTitle></CardHeader>
          <CardContent>
            <Link href="/employer/company" className="text-primary underline">Manage company</Link>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-3">
        <Link href="/employer/jobs/new">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Create job</button>
        </Link>
        <Link href="/employer/jobs">
          <button className="px-4 py-2 border rounded-md">Manage jobs</button>
        </Link>
      </div>
    </div>
  );
}