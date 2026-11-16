import { z } from "zod";
const eventTypes = ["online", "in-person"] as const;
const eventStatuses = ["draft", "published", "cancelled"] as const;
export const createEventSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.string().max(60).optional(),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().max(200).optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  eventType: z.enum(eventTypes).optional(),
  capacity: z.number().int().positive(),
  registrationDeadline: z.string().optional(),
  status: z.enum(eventStatuses).optional(),
});
export const updateEventSchema = createEventSchema.partial();
export const eventQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(["free", "paid"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});