"use client";

import { useEffect, useState } from "react";
import { getMyCompany, createCompany, updateCompany } from "@/services/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        const c = res.data;
        if (c?._id) setId(c._id);
        setMessage("Company created.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            {message && <p className="text-sm text-primary">{message}</p>}
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}