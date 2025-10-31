import bcrypt from "bcryptjs";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { createUser, getUserByUsername, getUserById, updateUserLastSignIn } from "./db";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
});

// Helper functions
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Auth router
export const authRouter = router({
  // Login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;

      // Get user by username
      const user = await getUserByUsername(username);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      // Update last sign in
      await updateUserLastSignIn(user.id);

      // Generate JWT token
      const token = generateToken(user.id);

      // Set cookie
      ctx.res.cookie("app_session_id", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),

  // Register
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { username, password, name, email } = input;

      // Check if username already exists
      const existing = await getUserByUsername(username);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const userId = nanoid();
      await createUser({
        id: userId,
        username,
        password: hashedPassword,
        name: name || null,
        email: email || null,
        role: "user",
        createdAt: new Date(),
        lastSignedIn: new Date(),
      });

      return {
        success: true,
        message: "User registered successfully",
      };
    }),

  // Get current user (me)
  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.app_session_id;
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      // Clear invalid cookie
      ctx.res.clearCookie("app_session_id", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return null;
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }),

  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("app_session_id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
    };
  }),
});

