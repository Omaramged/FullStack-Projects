import { z } from "zod";

export const createApplicationSchema = z.object({
  resumeUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().max(3000).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["applied", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"]),
  note: z.string().max(500).optional(),
});