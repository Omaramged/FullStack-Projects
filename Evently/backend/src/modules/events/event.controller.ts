import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import { authorize } from "../../middleware/authorize";
import * as eventService from "./event.service";
import { createEventSchema, updateEventSchema, eventQuerySchema } from "./event.validation";

export const list = [
  validate(eventQuerySchema, "query"),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await eventService.listEvents(req.query as Record<string, unknown>);
    res.status(200).json(successResponse(result));
  }),
];
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const event = await eventService.getEventById(id);
  if (!event) { res.status(404).json({ success: false, message: "Event not found" }); return; }
  const tickets = await eventService.getEventTicketTypes(id);
  res.status(200).json(successResponse({ event, tickets }));
});
export const create = [
  authorize("organizer", "admin"),
  validate(createEventSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const event = await eventService.createEvent(req.user!.id, req.body);
    res.status(201).json(successResponse(event, "Event created"));
  }),
];
export const listMine = [
  authorize("organizer", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const events = await eventService.listOrganizerEvents(req.user!.id);
    res.status(200).json(successResponse(events));
  }),
];
export const update = [
  authorize("organizer", "admin"),
  validate(updateEventSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const event = await eventService.updateEvent(id, req.user!.id, req.body);
    res.status(200).json(successResponse(event, "Event updated"));
  }),
];
export const remove = [
  authorize("organizer", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    await eventService.deleteEvent(id, req.user!.id);
    res.status(200).json(successResponse(null, "Event deleted"));
  }),
];
export const createTicketType = [
  authorize("organizer", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const tt = await eventService.createTicketType(id, req.user!.id, req.body);
    res.status(201).json(successResponse(tt, "Ticket type created"));
  }),
];