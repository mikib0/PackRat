import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { db } from '~/db';
import { packs } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { computePacksWeights } from '~/lib/utils/compute-pack';

export async function GET(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;

    // Get all packs for the user
    const userPacks = await db.query.packs.findMany({
      where: eq(packs.userId, userId),
      with: {
        items: true,
      },
    });

    // Compute weights for all packs
    const packsWithWeights = computePacksWeights(userPacks);

    return Response.json(packsWithWeights);
  } catch (error) {
    console.error('Error fetching packs:', error);
    return Response.json({ error: 'Failed to fetch packs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const data = await req.json();

    // Create the pack
    const [newPack] = await db
      .insert(packs)
      .values({
        name: data.name,
        description: data.description,
        category: data.category,
        userId,
        isPublic: data.isPublic || false,
        image: data.image,
        tags: data.tags || [],
      })
      .returning();

    // Return the new pack with empty items array
    const packWithItems = {
      ...newPack,
      items: [],
    };

    // Compute weights
    const packWithWeights = computePacksWeights([packWithItems])[0];

    return Response.json(packWithWeights);
  } catch (error) {
    console.error('Error creating pack:', error);
    return Response.json({ error: 'Failed to create pack' }, { status: 500 });
  }
}
