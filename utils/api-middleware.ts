import { verifyJWT } from './auth';

export async function authenticateRequest(request: Request): Promise<{ userId: number } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJWT(token);

  if (!payload) {
    return null;
  }

  return { userId: payload.userId };
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
