"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getJob, type Job } from "@/services/jobs";
import { applyToJob } from "@/services/applications";
import { saveJob, unsaveJob } from "@/services/saved";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

import { Suspense } from "react";

function JobDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setApplying(true);
    setMessage("");
    try {
      await applyToJob(id, { resumeUrl, coverLetter });
      setMessage("Application submitted successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      if (saved) {
        await unsaveJob(id);
        setSaved(false);
      } else {
        await saveJob(id);
        setSaved(true);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!job) return <div className="p-6">Job not found.</div>;

  const company = typeof job.companyId === "object" ? job.companyId : null;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      <Link href="/jobs" className="text-sm text-muted-foreground hover:underline">
        ← Back to jobs
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <p className="text-muted-foreground">
            {company?.name} {job.location ? `· ${job.location}` : ""}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.employmentType && <Badge>{job.employmentType}</Badge>}
            {job.workplaceType && <Badge variant="secondary">{job.workplaceType}</Badge>}
            {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.salaryMin || job.salaryMax ? (
            <p className="text-sm">
              Salary: {job.salaryMin ?? "?"} - {job.salaryMax ?? "?"} {job.salaryCurrency}
            </p>
          ) : null}
          <section>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="whitespace-pre-line text-sm">{job.description}</p>
          </section>
          {job.responsibilities && (
            <section>
              <h3 className="font-semibold mb-1">Responsibilities</h3>
              <p className="whitespace-pre-line text-sm">{job.responsibilities}</p>
            </section>
          )}
          {job.requirements && (
            <section>
              <h3 className="font-semibold mb-1">Requirements</h3>
              <p className="whitespace-pre-line text-sm">{job.requirements}</p>
            </section>
          )}
          {job.skills && job.skills.length > 0 && (
            <section>
              <h3 className="font-semibold mb-1">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {job.skills.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </section>
          )}
          {job.benefits && (
            <section>
              <h3 className="font-semibold mb-1">Benefits</h3>
              <p className="whitespace-pre-line text-sm">{job.benefits}</p>
            </section>
          )}
          {message && <p className="text-sm text-primary">{message}</p>}
          <div className="flex gap-3 pt-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Button disabled={user?.role !== "candidate"} onClick={() => setDialogOpen(true)}>Apply</Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply to {job.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm">Resume URL</label>
                    <Input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Cover letter</label>
                    <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                  </div>
                  <Button onClick={handleApply} disabled={applying} className="w-full">
                    {applying ? "Submitting..." : "Submit application"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSave}>
              {saved ? "Unsave" : "Save job"}
            </Button>
          </div>
          {user?.role !== "candidate" && (
            <p className="text-xs text-muted-foreground">Sign in as a candidate to apply or save jobs.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default function JobDetailPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <JobDetailContent />
    </Suspense>
  );
}
