import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { db } from '~/db';
import { catalogItems } from '~/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, params: { id: string }) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }
    const itemId = Number(params.id);

    const item = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!item) {
      return Response.json({ error: 'Catalog item not found' }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error('Error fetching catalog item:', error);
    return Response.json({ error: 'Failed to fetch catalog item' }, { status: 500 });
  }
}

// TODO: allow admins to update catalog items
export async function PUT(req: Request, params: { id: string }) {
  try {
    // Only admins should be able to update catalog items
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just use authentication

    const itemId = Number(params.id);
    const data = await req.json();

    // Check if the catalog item exists
    const existingItem = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!existingItem) {
      return Response.json({ error: 'Catalog item not found' }, { status: 404 });
    }

    // Update the catalog item
    const [updatedItem] = await db
      .update(catalogItems)
      .set({
        name: data.name,
        description: data.description,
        defaultWeight: data.defaultWeight,
        defaultWeightUnit: data.defaultWeightUnit,
        category: data.category,
        image: data.image,
        brand: data.brand,
        model: data.model,
        url: data.url,

        // New fields
        ratingValue: data.ratingValue,
        productUrl: data.productUrl,
        color: data.color,
        size: data.size,
        sku: data.sku,
        price: data.price,
        availability: data.availability,
        seller: data.seller,
        productSku: data.productSku,
        material: data.material,
        currency: data.currency,
        condition: data.condition,
        techs: data.techs,
        links: data.links,
        reviews: data.reviews,

        updatedAt: new Date(),
      })
      .where(eq(catalogItems.id, itemId))
      .returning();

    return Response.json(updatedItem);
  } catch (error) {
    console.error('Error updating catalog item:', error);
    return Response.json({ error: 'Failed to update catalog item' }, { status: 500 });
  }
}

// TODO: allow admins to delete catalog items
export async function DELETE(req: Request, params: { id: string }) {
  try {
    // Only admins should be able to delete catalog items
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just use authentication

    const itemId = Number(params.id);

    // Check if the catalog item exists
    const existingItem = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!existingItem) {
      return Response.json({ error: 'Catalog item not found' }, { status: 404 });
    }

    // Delete the catalog item
    await db.delete(catalogItems).where(eq(catalogItems.id, itemId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting catalog item:', error);
    return Response.json({ error: 'Failed to delete catalog item' }, { status: 500 });
  }
}
