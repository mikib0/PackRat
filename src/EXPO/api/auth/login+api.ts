import { db } from "../../../db"
import { users, refreshTokens } from '../../../db/schema';
import { verifyPassword, generateJWT, generateRefreshToken } from '../../../utils/auth';
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (user.length === 0) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user[0].passwordHash!);

    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if email is verified
    if (!user[0].emailVerified) {
      return Response.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
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

    return Response.json({
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
    console.error("Login error:", error)
    return Response.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

