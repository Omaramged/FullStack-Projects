"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role === "organizer" || user.role === "admin") router.replace("/organizer/dashboard");
    else router.replace("/attendee/dashboard");
  }, [user, loading, router]);
  return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
}