// Used for resending verification code for new accounts
import { db } from '../../../db';
import { users, oneTimePasswords } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { generateVerificationCode } from '../../../utils/auth';
import { sendVerificationCodeEmail } from '../../../utils/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the user by email
    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // Check if user is already verified
    if (user[0].emailVerified) {
      return Response.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Delete any existing verification codes
    await db.delete(oneTimePasswords).where(eq(oneTimePasswords.userId, userId));

    // Generate new verification code
    const code = generateVerificationCode(5);

    // Store code in database
    await db.insert(oneTimePasswords).values({
      userId,
      code,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email with code
    await sendVerificationCodeEmail(email, code);

    return Response.json({
      success: true,
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return Response.json(
      { error: 'An error occurred while resending verification code' },
      { status: 500 }
    );
  }
}
