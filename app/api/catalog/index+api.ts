import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { db } from '~/db';
import { catalogItems } from '~/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Get a specific catalog item
      const item = await db.query.catalogItems.findFirst({
        where: eq(catalogItems.id, Number.parseInt(id)),
      });

      if (!item) {
        return Response.json({ error: 'Catalog item not found' }, { status: 404 });
      }

      return Response.json(item);
    } else {
      // Get all catalog items
      const items = await db.query.catalogItems.findMany();
      return Response.json(items);
    }
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    return Response.json({ error: 'Failed to fetch catalog items' }, { status: 500 });
  }
}

// TODO: allow admins to create catalog items
export async function POST(req: Request) {
  try {
    // Only admins should be able to create catalog items
    const auth = await authenticateRequest(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just use authentication

    const data = await req.json();

    // Create the catalog item
    const [newItem] = await db
      .insert(catalogItems)
      .values({
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
      })
      .returning();

    return Response.json(newItem);
  } catch (error) {
    console.error('Error creating catalog item:', error);
    return Response.json({ error: 'Failed to create catalog item' }, { status: 500 });
  }
}
