import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  industry: z.string().max(80).optional(),
  companySize: z.string().max(40).optional(),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().max(120).optional(),
});

export const updateCompanySchema = createCompanySchema.partial();