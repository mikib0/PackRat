import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { db } from '~/db';
import { packs, packItems } from '~/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request, params: { packId: string; itemId: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);
    const itemId = Number(params.itemId);

    // Check if the pack exists and belongs to the user
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Get the item
    const item = await db.query.packItems.findFirst({
      where: and(eq(packItems.id, itemId), eq(packItems.packId, packId)),
      with: {
        catalogItem: true,
      },
    });

    if (!item) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error('Error fetching pack item:', error);
    return Response.json({ error: 'Failed to fetch pack item' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { packId: string; itemId: string } }
) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);
    const itemId = Number(params.itemId);
    const data = await req.json();

    // Check if the pack exists and belongs to the user
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Check if the item exists and belongs to the pack
    const existingItem = await db.query.packItems.findFirst({
      where: and(eq(packItems.id, itemId), eq(packItems.packId, packId)),
    });

    if (!existingItem) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    // Update the item
    const [updatedItem] = await db
      .update(packItems)
      .set({
        name: data.name,
        description: data.description,
        weight: data.weight,
        weightUnit: data.weightUnit,
        quantity: data.quantity,
        category: data.category,
        consumable: data.consumable,
        worn: data.worn,
        image: data.image,
        notes: data.notes,
        catalogItemId: data.catalogItemId ? Number(data.catalogItemId) : null,
        updatedAt: new Date(),
      })
      .where(eq(packItems.id, itemId))
      .returning();

    // Update the pack's updatedAt timestamp
    await db.update(packs).set({ updatedAt: new Date() }).where(eq(packs.id, packId));

    return Response.json(updatedItem);
  } catch (error) {
    console.error('Error updating pack item:', error);
    return Response.json({ error: 'Failed to update pack item' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { packId: string; itemId: string } }
) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    const userId = auth.userId;
    const packId = Number(params.packId);
    const itemId = Number(params.itemId);

    // Check if the pack exists and belongs to the user
    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, userId)),
    });

    if (!pack) {
      return Response.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Check if the item exists and belongs to the pack
    const existingItem = await db.query.packItems.findFirst({
      where: and(eq(packItems.id, itemId), eq(packItems.packId, packId)),
    });

    if (!existingItem) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    // Delete the item
    await db.delete(packItems).where(eq(packItems.id, itemId));

    // Update the pack's updatedAt timestamp
    await db.update(packs).set({ updatedAt: new Date() }).where(eq(packs.id, packId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting pack item:', error);
    return Response.json({ error: 'Failed to delete pack item' }, { status: 500 });
  }
}
