import { apiFetch } from "./api";
export async function createBooking(data: { eventId: string; ticketTypeId: string; quantity: number }) {
  return apiFetch<{ success: boolean; data: { booking: { _id: string; bookingCode: string }; tickets: { _id: string; ticketCode: string; qrCode: string }[] } }>("/bookings", { method: "POST", body: JSON.stringify(data) });
}
export async function myBookings() { return apiFetch<{ success: boolean; data: unknown[] }>("/bookings/my-bookings"); }
export async function getBooking(id: string) { return apiFetch<{ success: boolean; data: { booking: unknown; tickets: unknown[] } }>(`/bookings/${id}`); }
export async function cancelBooking(id: string) { return apiFetch(`/bookings/${id}/cancel`, { method: "PUT" }); }