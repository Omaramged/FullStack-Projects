"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { myApplications } from "@/services/applications";
import { listSavedJobs } from "@/services/saved";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total applications</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{apps.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Saved jobs</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{saved.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <Link href="/candidate/profile" className="text-primary underline">Edit profile</Link>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent applications</CardTitle></CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <p className="text-muted-foreground">No applications yet. <Link href="/jobs" className="text-primary underline">Browse jobs</Link></p>
          ) : (
            <ul className="space-y-2">
              {(apps as { _id: string; jobId?: { title?: string }; status?: string }[]).slice(0, 5).map((a) => (
                <li key={a._id} className="flex justify-between border-b pb-2">
                  <span>{a.jobId?.title ?? "Job"}</span>
                  <span className="text-sm text-muted-foreground">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}