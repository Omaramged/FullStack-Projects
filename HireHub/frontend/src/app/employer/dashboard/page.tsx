"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { myJobs } from "@/services/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Building2 } from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<unknown[]>([]);

  useEffect(() => {
    myJobs().then((r) => setJobs(r.data)).catch(() => {});
  }, []);

  const active = (jobs as { status?: string }[]).filter((j) => j.status === "published").length;

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/employer/company"><Button variant="outline">Company profile</Button></Link>
          <Link href="/employer/jobs/new"><Button>Post a job</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{jobs.length}</div></CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active jobs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{active}</div></CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Company</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/employer/company" className="text-sm font-medium text-primary hover:underline">Manage →</Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent jobs</CardTitle>
          <Link href="/employer/jobs" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-muted-foreground">No jobs posted yet.</p>
              <Link href="/employer/jobs/new"><Button size="sm">Create your first job</Button></Link>
            </div>
          ) : (
            <div className="divide-y">
              {(jobs as { _id: string; title: string; status?: string }[]).slice(0, 6).map((j) => (
                <div key={j._id} className="flex items-center justify-between py-3">
                  <p className="font-medium text-sm">{j.title}</p>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted capitalize">{j.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}