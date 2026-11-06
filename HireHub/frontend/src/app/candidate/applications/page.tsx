"use client";

import { useEffect, useState } from "react";
import { myApplications } from "@/services/applications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myApplications().then((r) => setApps(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Applications</h1>
      {loading ? <p>Loading...</p> : apps.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="grid gap-4">
          {(apps as { _id: string; jobId?: { title?: string; location?: string }; companyId?: { name?: string }; status?: string; appliedAt?: string }[]).map((a) => (
            <Card key={a._id}>
              <CardHeader>
                <CardTitle>{a.jobId?.title ?? "Job"}</CardTitle>
                <p className="text-sm text-muted-foreground">{a.companyId?.name} {a.jobId?.location ? `· ${a.jobId.location}` : ""}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <Badge>{a.status}</Badge>
                <span className="text-xs text-muted-foreground">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : ""}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}