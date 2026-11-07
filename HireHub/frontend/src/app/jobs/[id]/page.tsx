"use client";

import { useEffect, useState, Suspense } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Building2, DollarSign, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    if (!user) { router.push("/login"); return; }
    setApplying(true);
    setMessage("");
    try {
      await applyToJob(id, { resumeUrl, coverLetter });
      setMessage("Application submitted successfully.");
      setDialogOpen(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { router.push("/login"); return; }
    try {
      if (saved) { await unsaveJob(id); setSaved(false); }
      else { await saveJob(id); setSaved(true); }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  if (loading) return <div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>;
  if (!job) return <div className="container mx-auto p-6 text-center text-muted-foreground">Job not found.</div>;

  const company = typeof job.companyId === "object" ? job.companyId : null;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
      <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl">{job.title}</CardTitle>
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {company?.name ?? "Company"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant={saved ? "secondary" : "outline"} onClick={handleSave}>
                {saved ? "Saved" : "Save job"}
              </Button>
              <Button onClick={() => (user ? setDialogOpen(true) : router.push("/login"))}>Apply now</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.employmentType && <Badge>{job.employmentType.replace("_", " ")}</Badge>}
            {job.workplaceType && <Badge variant="secondary">{job.workplaceType}</Badge>}
            {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
            {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
            {(job.salaryMin || job.salaryMax) && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salaryMin ?? "?"} – {job.salaryMax ?? "?"} {job.salaryCurrency}</span>}
            {job.applicationDeadline && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Deadline {new Date(job.applicationDeadline).toLocaleDateString()}</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && <p className="text-sm text-primary">{message}</p>}
          <section className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{job.description}</p>
          </section>
          {job.responsibilities && (
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Responsibilities</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{job.responsibilities}</p>
            </section>
          )}
          {job.requirements && (
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Requirements</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{job.requirements}</p>
            </section>
          )}
          {job.skills && job.skills.length > 0 && (
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </section>
          )}
          {job.benefits && (
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Benefits</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{job.benefits}</p>
            </section>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply to {job.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume URL</label>
              <Input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover letter</label>
              <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5} />
            </div>
            <Button onClick={handleApply} disabled={applying} className="w-full">
              {applying ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6"><div className="h-40 animate-pulse bg-muted rounded-xl" /></div>}>
      <JobDetailContent />
    </Suspense>
  );
}