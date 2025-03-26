import { db } from '../../../db';
import { users, oneTimePasswords } from '../../../db/schema';
import {
  hashPassword,
  generateVerificationCode,
  validatePassword,
  validateEmail,
} from '../../../utils/auth';
import { sendVerificationCodeEmail } from '../../../utils/email';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return Response.json({ error: passwordValidation.message }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json({ error: 'Email already in use' }, { status: 409 });
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

    return Response.json({
      success: true,
      message: 'User registered successfully. Please check your email for your verification code.',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
