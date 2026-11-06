"use client";

import { useEffect, useState } from "react";
import { myJobs } from "@/services/jobs";
import { deleteJob, setJobStatus } from "@/services/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    myJobs().then((r) => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const handleStatus = async (id: string, status: string) => {
    await setJobStatus(id, status);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this draft job?")) return;
    await deleteJob(id);
    refresh();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Link href="/employer/jobs/new"><Button>Create job</Button></Link>
      </div>
      {loading ? <p>Loading...</p> : jobs.length === 0 ? (
        <p className="text-muted-foreground">No jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {(jobs as { _id: string; title: string; status?: string }[]).map((j) => (
            <Card key={j._id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{j.title}</CardTitle>
                <Badge>{j.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Link href={`/employer/jobs/${j._id}/applicants`}>
                  <Button variant="outline" size="sm">Applicants</Button>
                </Link>
                {j.status === "draft" && (
                  <>
                    <Button size="sm" onClick={() => handleStatus(j._id, "published")}>Publish</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(j._id)}>Delete</Button>
                  </>
                )}
                {j.status === "published" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus(j._id, "paused")}>Pause</Button>
                )}
                {j.status === "paused" && (
                  <Button size="sm" onClick={() => handleStatus(j._id, "published")}>Resume</Button>
                )}
                {j.status !== "closed" && j.status !== "draft" && (
                  <Button size="sm" variant="destructive" onClick={() => handleStatus(j._id, "closed")}>Close</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}