"use client";

import { useEffect, useState } from "react";
import { listSavedJobs } from "@/services/saved";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SavedJobsPage() {
  const [saved, setSaved] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSavedJobs().then((r) => setSaved(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Saved Jobs</h1>
      {loading ? <p>Loading...</p> : saved.length === 0 ? (
        <p className="text-muted-foreground">No saved jobs.</p>
      ) : (
        <div className="grid gap-4">
          {(saved as { _id: string; jobId?: { _id?: string; title?: string; location?: string; companyId?: { name?: string } } }[]).map((s) => (
            <Card key={s._id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/jobs/${s.jobId?._id}`} className="hover:underline">{s.jobId?.title ?? "Job"}</Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{s.jobId?.companyId?.name} {s.jobId?.location ? `· ${s.jobId.location}` : ""}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}