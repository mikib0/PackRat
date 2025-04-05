import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateRequest, unauthorizedResponse } from '../../../utils/api-middleware';

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);

    if (!auth) {
      return unauthorizedResponse();
    }

    console.log('auth', auth);
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

    console.log('user', user);

    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return Response.json({ error: 'An error occurred' }, { status: 500 });
  }
}
