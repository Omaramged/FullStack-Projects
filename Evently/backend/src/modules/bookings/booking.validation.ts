import { z } from "zod";
export const createBookingSchema = z.object({
  eventId: z.string().min(1),
  ticketTypeId: z.string().min(1),
  quantity: z.number().int().positive().max(10),
});