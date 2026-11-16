import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import { authorize } from "../../middleware/authorize";
import * as bookingService from "./booking.service";
import { createBookingSchema } from "./booking.validation";

export const create = [
  authorize("attendee", "admin"),
  validate(createBookingSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await bookingService.createBooking(req.user!.id, req.body);
    res.status(201).json(successResponse(result, "Booking created"));
  }),
];
export const myBookings = [
  authorize("attendee", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const bookings = await bookingService.getMyBookings(req.user!.id);
    res.status(200).json(successResponse(bookings));
  }),
];
export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const result = await bookingService.getBookingById(id, req.user!.id, req.user!.role);
  if (!result) { res.status(404).json({ success: false, message: "Booking not found" }); return; }
  res.status(200).json(successResponse(result));
});
export const cancel = [
  authorize("attendee", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const booking = await bookingService.cancelBooking(id, req.user!.id);
    res.status(200).json(successResponse(booking, "Booking cancelled"));
  }),
];
export const checkIn = [
  authorize("organizer", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { ticketCode } = req.body;
    const ticket = await bookingService.checkInTicket(ticketCode, req.user!.id);
    res.status(200).json(successResponse(ticket, "Checked in"));
  }),
];
export const attendees = [
  authorize("organizer", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const bookings = await bookingService.getEventAttendees(id, req.user!.id);
    res.status(200).json(successResponse(bookings));
  }),
];