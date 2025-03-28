import { db } from '~/db';
import { users, oneTimePasswords } from '~/db/schema';
import { hashPassword, validatePassword } from '~/utils/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return Response.json(
        { error: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return Response.json({ error: passwordValidation.message }, { status: 400 });
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (userResult.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    // Find verification code
    const codeRecord = await db
      .select()
      .from(oneTimePasswords)
      .where(and(eq(oneTimePasswords.userId, user.id), eq(oneTimePasswords.code, code)))
      .limit(1);

    if (codeRecord.length === 0) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Check if code is expired
    if (new Date() > codeRecord[0].expiresAt) {
      return Response.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user's password
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

    // Delete the used verification code
    await db.delete(oneTimePasswords).where(eq(oneTimePasswords.id, codeRecord[0].id));

    return Response.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return Response.json({ error: 'An error occurred during password reset' }, { status: 500 });
  }
}
