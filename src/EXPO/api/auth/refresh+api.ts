import { db } from '../../../db';
import { users, refreshTokens } from '../../../db/schema';
import { generateJWT, generateRefreshToken } from '../../../utils/auth';
import { eq, and, isNull } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return Response.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    // Find the refresh token in the database
    const tokenRecord = await db
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        expiresAt: refreshTokens.expiresAt,
      })
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, refreshToken), isNull(refreshTokens.revokedAt)))
      .limit(1);

    if (tokenRecord.length === 0) {
      return Response.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const token = tokenRecord[0];

    // Check if token is expired
    if (new Date() > token.expiresAt) {
      return Response.json({ error: 'Refresh token expired' }, { status: 401 });
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

    return Response.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      user: user[0],
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return Response.json({ error: 'An error occurred during token refresh' }, { status: 500 });
  }
}
