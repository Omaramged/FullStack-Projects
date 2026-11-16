"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => { setLoading(true); apiFetch<{ success: boolean; data: unknown[] }>("/admin/users").then((r) => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { refresh(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete this user?")) return; await apiFetch(`/admin/users/${id}`, { method: "DELETE" }); refresh(); };
  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      {loading ? <p>Loading...</p> : (
        <Card className="border-border/60"><CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {(users as { _id: string; name: string; email: string; role: string }[]).map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell>
                  <TableCell><Button size="sm" variant="destructive" onClick={() => handleDelete(u._id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}