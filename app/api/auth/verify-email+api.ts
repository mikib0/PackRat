import { db } from '../../../db';
import { users, oneTimePasswords } from '../../../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { generateJWT } from '../../../utils/auth';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
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
      return Response.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Update user as verified
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));

    // Delete the verification code
    await db.delete(oneTimePasswords).where(eq(oneTimePasswords.userId, userId));

    // Generate JWT token
    const token = generateJWT({ userId: userId });

    return Response.json({
      success: true,
      message: 'Email verified successfully',
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
    console.error('Email verification error:', error);
    return Response.json({ error: 'An error occurred during email verification' }, { status: 500 });
  }
}
