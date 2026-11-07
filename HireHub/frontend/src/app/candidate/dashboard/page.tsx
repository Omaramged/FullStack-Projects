"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { myApplications } from "@/services/applications";
import { listSavedJobs } from "@/services/saved";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Bookmark, User } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<unknown[]>([]);
  const [saved, setSaved] = useState<unknown[]>([]);

  useEffect(() => {
    myApplications().then((r) => setApps(r.data)).catch(() => {});
    listSavedJobs().then((r) => setSaved(r.data)).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your job search.</p>
        </div>
        <Link href="/jobs"><Button>Browse jobs</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{apps.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{saved.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/candidate/profile" className="text-sm font-medium text-primary hover:underline">Edit profile →</Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Recent applications</CardTitle></CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-muted-foreground">No applications yet.</p>
              <Link href="/jobs"><Button variant="outline" size="sm">Browse jobs</Button></Link>
            </div>
          ) : (
            <div className="divide-y">
              {(apps as { _id: string; jobId?: { title?: string }; status?: string; appliedAt?: string }[]).slice(0, 6).map((a) => (
                <div key={a._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{a.jobId?.title ?? "Job"}</p>
                    <p className="text-xs text-muted-foreground">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : ""}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}