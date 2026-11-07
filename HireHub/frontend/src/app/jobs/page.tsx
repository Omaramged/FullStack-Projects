"use client";

import { useEffect, useState } from "react";
import { listJobs, type Job } from "@/services/jobs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await listJobs({ search, location, page, limit: 12 });
      setJobs(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find your next role</h1>
        <p className="text-muted-foreground">Discover opportunities from top companies.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Job title or keyword" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <Button onClick={() => { setPage(1); fetchJobs(); }} className="sm:w-32">Search</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No jobs found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const company = typeof job.companyId === "object" ? job.companyId : null;
            return (
              <Card key={job._id} className="group hover:shadow-lg hover:-translate-y-0.5 transition-all border-border/60">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{company?.name ?? "Company"}{job.location ? ` · ${job.location}` : ""}</p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {job.employmentType && <Badge variant="secondary" className="text-xs">{job.employmentType.replace("_", " ")}</Badge>}
                  {job.workplaceType && <Badge variant="outline" className="text-xs">{job.workplaceType}</Badge>}
                  {job.experienceLevel && <Badge variant="outline" className="text-xs">{job.experienceLevel}</Badge>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex justify-center items-center gap-3 pt-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}