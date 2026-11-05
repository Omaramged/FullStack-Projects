import crypto from "crypto";
import { User } from "../../models/User";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/email";
import { env } from "../../config/env";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
}) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    const err = new Error("Email already in use") as Error & { statusCode: number };
    err.statusCode = 409;
    throw err;
  }

  const password = await hashPassword(input.password);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    name: input.name,
    email: input.email,
    password,
    role: input.role,
    emailVerificationToken: hashToken(verificationToken),
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  await sendEmail(
    user.email,
    "Verify your HireHub email",
    `<p>Hi ${user.name},</p><p>Verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`
  );

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken(user._id.toString());
  return { user, accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password") as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error("Invalid email or password") as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken(user._id.toString());
  return { user, accessToken, refreshToken };
}

export async function verifyEmailToken(token: string) {
  const hashed = hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: new Date() },
  });
  if (!user) {
    const err = new Error("Invalid or expired verification token") as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email });
  if (!user) return; // don't reveal
  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail(
    user.email,
    "Reset your HireHub password",
    `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>. It expires in 1 hour.</p>`
  );
}

export async function resetPassword(token: string, newPassword: string) {
  const hashed = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password");
  if (!user) {
    const err = new Error("Invalid or expired reset token") as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }
  user.password = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return user;
}