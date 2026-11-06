"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "employer") router.replace("/employer/dashboard");
    else if (user.role === "admin") router.replace("/admin/dashboard");
    else router.replace("/candidate/dashboard");
  }, [user, loading, router]);

  return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
}