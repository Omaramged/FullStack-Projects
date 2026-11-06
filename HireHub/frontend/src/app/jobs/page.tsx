"use client";

import { useEffect, useState } from "react";
import { listJobs, type Job } from "@/services/jobs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      const res = await listJobs({ search, location, page, limit: 10 });
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Find Jobs</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search title/keywords" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Button onClick={() => { setPage(1); fetchJobs(); }}>Search</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted-foreground">No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const company = typeof job.companyId === "object" ? job.companyId : null;
            return (
              <Card key={job._id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/jobs/${job._id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {company?.name ?? "Company"} {job.location ? `· ${job.location}` : ""}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {job.employmentType && <Badge variant="secondary">{job.employmentType}</Badge>}
                  {job.workplaceType && <Badge variant="outline">{job.workplaceType}</Badge>}
                  {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="self-center text-sm">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}