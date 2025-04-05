import { db } from "@/db";
import { oneTimePasswords, refreshTokens, users } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import {
  generateJWT,
  generateRefreshToken,
  generateVerificationCode,
  hashPassword,
  validateEmail,
  validatePassword,
  verifyPassword,
} from "@/utils/auth";
import { sendVerificationCodeEmail } from "@/utils/email";
import { and, eq, gt, isNull } from "drizzle-orm";
import { Hono } from "hono";

const authRoutes = new Hono();

// Login route
authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user[0].passwordHash!
    );

    if (!isPasswordValid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Check if email is verified
    if (!user[0].emailVerified) {
      return c.json(
        { error: "Please verify your email before logging in" },
        403
      );
    }

    // Generate refresh token
    const refreshToken = generateRefreshToken();

    // Store refresh token
    await db.insert(refreshTokens).values({
      userId: user[0].id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Generate JWT (access token)
    const accessToken = generateJWT({ userId: user[0].id });

    return c.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        emailVerified: user[0].emailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "An error occurred during login" }, 500);
  }
});

// Register route
authRoutes.post("/register", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    if (!validateEmail(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ error: passwordValidation.message }, 400);
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "Email already in use" }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        emailVerified: false,
      })
      .returning({ id: users.id });

    const code = generateVerificationCode(5);

    // Store code in database
    await db.insert(oneTimePasswords).values({
      userId: newUser.id,
      code,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email with code
    await sendVerificationCodeEmail(email, code);

    return c.json({
      success: true,
      message:
        "User registered successfully. Please check your email for your verification code.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "An error occurred during registration" }, 500);
  }
});

// Verify email route
authRoutes.post("/verify-email", async (c) => {
  try {
    const { email, code } = await c.req.json();

    if (!email || !code) {
      return c.json({ error: "Email and verification code are required" }, 400);
    }

    // Find the user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    const userId = user[0].id;

    // Find the verification code
    const verificationCode = await db
      .select()
      .from(oneTimePasswords)
      .where(
        and(
          eq(oneTimePasswords.userId, userId),
          eq(oneTimePasswords.code, code),
          gt(oneTimePasswords.expiresAt, new Date())
        )
      )
      .limit(1);

    if (verificationCode.length === 0) {
      return c.json({ error: "Invalid or expired verification code" }, 400);
    }

    // Update user as verified
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, userId));

    // Delete the verification code
    await db
      .delete(oneTimePasswords)
      .where(eq(oneTimePasswords.userId, userId));

    // Generate JWT token
    const token = generateJWT({ userId: userId });

    return c.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return c.json(
      { error: "An error occurred during email verification" },
      500
    );
  }
});

// Refresh token route
authRoutes.post("/refresh", async (c) => {
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ error: "Refresh token is required" }, 400);
    }

    // Find the refresh token in the database
    const tokenRecord = await db
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        expiresAt: refreshTokens.expiresAt,
      })
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, refreshToken),
          isNull(refreshTokens.revokedAt)
        )
      )
      .limit(1);

    if (tokenRecord.length === 0) {
      return c.json({ error: "Invalid refresh token" }, 401);
    }

    const token = tokenRecord[0];

    // Check if token is expired
    if (new Date() > token.expiresAt) {
      return c.json({ error: "Refresh token expired" }, 401);
    }

    // Generate new refresh token
    const newRefreshToken = generateRefreshToken();

    // Revoke old refresh token and create new one
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        replacedByToken: newRefreshToken,
      })
      .where(eq(refreshTokens.id, token.id));

    // Store new refresh token
    await db.insert(refreshTokens).values({
      userId: token.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Generate new access token
    const accessToken = generateJWT({ userId: token.userId });

    // Get user info
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, token.userId))
      .limit(1);

    return c.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      user: user[0],
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return c.json({ error: "An error occurred during token refresh" }, 500);
  }
});

// Logout route
authRoutes.post("/logout", async (c) => {
  try {
    // Get refresh token from request body
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ error: "Refresh token is required" }, 400);
    }

    // Revoke the refresh token
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.token, refreshToken));

    return c.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "An error occurred during logout" }, 500);
  }
});

// Me route
authRoutes.get("/me", async (c) => {
  try {
    const auth = await authenticateRequest(c);

    if (!auth) {
      return unauthorizedResponse();
    }

    // Find user
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, auth.userId))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return c.json({ error: "An error occurred" }, 500);
  }
});

export { authRoutes };
