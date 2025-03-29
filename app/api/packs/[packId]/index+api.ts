import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { db } from '~/db';
import { packs, packItems } from '~/db/schema';
import { eq, and } from 'drizzle-orm';
import { computePackWeights } from '~/lib/utils/compute-pack';

export async function GET(req: Request, params: { packId: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);

    // Get the pack with its items
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
      with: {
        items: true,
      },
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Compute weights
    const packWithWeights = computePackWeights(pack);

    return Response.json(packWithWeights);
  } catch (error) {
    console.error('Error fetching pack:', error);
    return Response.json({ error: 'Failed to fetch pack' }, { status: 500 });
  }
}

export async function PUT(req: Request, { id }: { id: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(id);
    const data = await req.json();

    // Check if the pack exists and belongs to the user
    const existingPack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!existingPack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Update the pack
    const [updatedPack] = await db
      .update(packs)
      .set({
        name: data.name,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        image: data.image,
        tags: data.tags,
        updatedAt: new Date(),
      })
      .where(eq(packs.id, packId))
      .returning();

    // Get the pack items
    const packItemsList = await db.query.packItems.findMany({
      where: eq(packItems.packId, packId),
    });

    // Return the updated pack with its items
    const packWithItems = {
      ...updatedPack,
      items: packItemsList,
    };

    // Compute weights
    const packWithWeights = computePackWeights(packWithItems);

    return Response.json(packWithWeights);
  } catch (error) {
    console.error('Error updating pack:', error);
    return Response.json({ error: 'Failed to update pack' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { id }: { id: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(id);

    // Check if the pack exists and belongs to the user
    const existingPack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!existingPack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Delete the pack (cascade will delete items)
    await db.delete(packs).where(eq(packs.id, packId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return Response.json({ error: 'Failed to delete pack' }, { status: 500 });
  }
}
