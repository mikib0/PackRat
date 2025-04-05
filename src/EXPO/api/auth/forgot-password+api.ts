import { db } from '~/db';
import { users, oneTimePasswords } from '~/db/schema';
import { generateVerificationCode } from '~/utils/auth';
import { sendPasswordResetEmail } from '~/utils/email';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    // Always return success even if user doesn't exist (security best practice)
    if (user.length === 0) {
      return Response.json({
        success: true,
        message: 'If your email is registered, you will receive a verification code',
      });
    }

    // Generate verification code
    const code = generateVerificationCode(5);

    // Delete any existing codes for this user
    await db.delete(oneTimePasswords).where(eq(oneTimePasswords.userId, user[0].id));

    // Store code in database
    await db.insert(oneTimePasswords).values({
      userId: user[0].id,
      code,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    });

    // Send password reset email with code
    await sendPasswordResetEmail(email, code);

    return Response.json({
      success: true,
      message: 'If your email is registered, you will receive a verification code',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json({ error: 'An error occurred' }, { status: 500 });
  }
}
