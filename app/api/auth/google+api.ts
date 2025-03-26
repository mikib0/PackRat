import { db } from '../../../db';
import { users, authProviders, sessions } from '../../../db/schema';
import { generateJWT, generateToken } from '../../../utils/auth';
import { eq, and } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return Response.json({ error: 'Invalid Google token' }, { status: 400 });
    }

    // Check if user exists with this Google ID
    const existingProvider = await db
      .select()
      .from(authProviders)
      .where(and(eq(authProviders.provider, 'google'), eq(authProviders.providerId, payload.sub)))
      .limit(1);

    let userId: number;
    let isNewUser = false;

    if (existingProvider.length > 0) {
      // User exists, get user ID
      userId = existingProvider[0].userId;
    } else {
      // Check if user exists with this email
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, payload.email!))
        .limit(1);

      if (existingUser.length > 0) {
        // User exists with this email, link Google account
        userId = existingUser[0].id;

        await db.insert(authProviders).values({
          userId,
          provider: 'google',
          providerId: payload.sub,
        });
      } else {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            email: payload.email!,
            firstName: payload.given_name,
            lastName: payload.family_name,
            emailVerified: payload.email_verified || false,
          })
          .returning({ id: users.id });

        userId = newUser.id;
        isNewUser = true;

        // Link Google account
        await db.insert(authProviders).values({
          userId,
          provider: 'google',
          providerId: payload.sub,
        });
      }
    }

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
      .where(eq(users.id, userId))
      .limit(1);

    // Generate session token
    const sessionToken = generateToken();

    // Get device info from request
    const userAgent = request.headers.get('user-agent') || '';

    // Store session
    await db.insert(sessions).values({
      userId,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      deviceInfo: { userAgent },
    });

    // Generate JWT
    const token = generateJWT({ userId, sessionToken });

    return Response.json({
      success: true,
      token,
      user: user[0],
      isNewUser,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    return Response.json(
      { error: 'An error occurred during Google authentication' },
      { status: 500 }
    );
  }
}
