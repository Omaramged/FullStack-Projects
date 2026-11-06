"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {user?.email}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent>—</CardContent></Card>
        <Card><CardHeader><CardTitle>Jobs</CardTitle></CardHeader><CardContent>—</CardContent></Card>
        <Card><CardHeader><CardTitle>Applications</CardTitle></CardHeader><CardContent>—</CardContent></Card>
      </div>
    </div>
  );
}