"use client";

import { useEffect, useState } from "react";
import { getMyCompany, createCompany, updateCompany } from "@/services/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function CompanyPage() {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyCompany().then((r) => {
      const c = r.data as { _id?: string; name?: string; description?: string; industry?: string; location?: string; website?: string } | null;
      if (c) {
        setId(c._id ?? null);
        setName(c.name ?? "");
        setDescription(c.description ?? "");
        setIndustry(c.industry ?? "");
        setLocation(c.location ?? "");
        setWebsite(c.website ?? "");
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = { name, description, industry, location, website };
      if (id) {
        await updateCompany(id, data);
        setMessage("Company updated.");
      } else {
        const res = (await createCompany(data)) as { data?: { _id?: string } };
        if (res.data?._id) setId(res.data._id);
        setMessage("Company created.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company profile</h1>
        <p className="text-muted-foreground">Tell candidates about your company.</p>
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{id ? "Edit company" : "Create company"}</CardTitle>
              <CardDescription>Your public company information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What does your company do?" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Software" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / NYC" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
            {message && <p className="text-sm text-primary font-medium">{message}</p>}
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}