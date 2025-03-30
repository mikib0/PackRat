import { db } from "../../../db"
import { refreshTokens } from '../../../db/schema';
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    // Get refresh token from request body
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return Response.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    // Revoke the refresh token
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.token, refreshToken));

    return Response.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error("Logout error:", error)
    return Response.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

