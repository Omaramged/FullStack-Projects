"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { jobApplicants, updateApplicationStatus } from "@/services/applications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ApplicantsContent() {
  const params = useParams();
  const jobId = params.id as string;
  const [apps, setApps] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    jobApplicants(jobId).then((r) => setApps(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, [jobId]);

  const handleStatus = async (id: string, status: string | null) => {
    if (!status) return;
    await updateApplicationStatus(id, status as string);
    refresh();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Applicants</h1>
      {loading ? <p>Loading...</p> : apps.length === 0 ? (
        <p className="text-muted-foreground">No applicants yet.</p>
      ) : (
        <div className="grid gap-4">
          {(apps as { _id: string; candidateId?: { name?: string; email?: string }; status?: string }[]).map((a) => (
            <Card key={a._id}>
              <CardHeader>
                <CardTitle>{a.candidateId?.name ?? "Candidate"}</CardTitle>
                <p className="text-sm text-muted-foreground">{a.candidateId?.email}</p>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Badge>{a.status}</Badge>
                <Select onValueChange={(v) => handleStatus(a._id, v as string | null)}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Change status" /></SelectTrigger>
                  <SelectContent>
                    {["applied","reviewing","shortlisted","interview","offer","hired","rejected"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ApplicantsContent />
    </Suspense>
  );
}