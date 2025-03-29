import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { packs, packItems } from '~/db/schema';
import { eq, and } from 'drizzle-orm';
import { db } from '~/db';

export async function GET(req: Request, params: { packId: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);

    // Check if the pack exists and belongs to the user
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Get all items for the pack
    const items = await db.query.packItems.findMany({
      where: eq(packItems.packId, packId),
      with: {
        catalogItem: true,
      },
    });

    return Response.json(items);
  } catch (error) {
    console.error('Error fetching pack items:', error);
    return Response.json({ error: 'Failed to fetch pack items' }, { status: 500 });
  }
}

export async function POST(req: Request, params: { packId: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);
    const data = await req.json();

    // Check if the pack exists and belongs to the user
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Create the item
    const [newItem] = await db
      .insert(packItems)
      .values({
        name: data.name,
        description: data.description,
        weight: data.weight,
        weightUnit: data.weightUnit,
        quantity: data.quantity || 1,
        category: data.category,
        consumable: data.consumable || false,
        worn: data.worn || false,
        image: data.image,
        notes: data.notes,
        packId,
        catalogItemId: data.catalogItemId ? Number(data.catalogItemId) : null,
        userId,
      })
      .returning();

    // Update the pack's updatedAt timestamp
    await db.update(packs).set({ updatedAt: new Date() }).where(eq(packs.id, packId));

    return Response.json(newItem);
  } catch (error) {
    console.error('Error creating pack item:', error);
    return Response.json({ error: 'Failed to create pack item' }, { status: 500 });
  }
}
