import crypto from "crypto";
import { User } from "../../models/User";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { env } from "../../config/env";

export async function registerUser(input: { name: string; email: string; password: string; role: "attendee" | "organizer" }) {
  const existing = await User.findOne({ email: input.email });
  if (existing) { const e = new Error("Email already in use") as Error & { statusCode: number }; e.statusCode = 409; throw e; }
  const password = await hashPassword(input.password);
  const user = await User.create({ name: input.name, email: input.email, password, role: input.role });
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken(user._id.toString());
  return { user, accessToken, refreshToken };
}
export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) { const e = new Error("Invalid email or password") as Error & { statusCode: number }; e.statusCode = 401; throw e; }
  const ok = await comparePassword(password, user.password);
  if (!ok) { const e = new Error("Invalid email or password") as Error & { statusCode: number }; e.statusCode = 401; throw e; }
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken(user._id.toString());
  return { user, accessToken, refreshToken };
}