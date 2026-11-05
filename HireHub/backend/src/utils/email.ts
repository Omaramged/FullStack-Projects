import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.log(`[email skipped - no RESEND_API_KEY] to=${to} subject=${subject}`);
    return;
  }
  try {
    await resend.emails.send({
      from: env.EMAIL_FROM ?? "HireHub <no-reply@hirehub.local>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}