import { z } from "zod";

const employmentTypes = ["full_time", "part_time", "contract", "internship", "temporary"] as const;
const experienceLevels = ["entry", "mid", "senior", "lead", "executive"] as const;
const workplaceTypes = ["onsite", "remote", "hybrid"] as const;
const jobStatuses = ["draft", "published", "paused", "closed"] as const;

export const createJobSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().min(10),
  responsibilities: z.string().max(5000).optional(),
  requirements: z.string().max(5000).optional(),
  skills: z.array(z.string()).optional(),
  category: z.string().max(80).optional(),
  employmentType: z.enum(employmentTypes).optional(),
  experienceLevel: z.enum(experienceLevels).optional(),
  workplaceType: z.enum(workplaceTypes).optional(),
  location: z.string().max(120).optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  salaryCurrency: z.string().max(8).optional(),
  benefits: z.string().max(2000).optional(),
  status: z.enum(jobStatuses).optional(),
  applicationDeadline: z.string().datetime().optional(),
});

export const updateJobSchema = createJobSchema.partial().omit({ companyId: true });

export const jobQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  employmentType: z.enum(employmentTypes).optional(),
  experienceLevel: z.enum(experienceLevels).optional(),
  workplaceType: z.enum(workplaceTypes).optional(),
  status: z.enum(jobStatuses).optional(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});