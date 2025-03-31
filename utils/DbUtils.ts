import { db } from '~/db';
import { packs, packItems, catalogItems, users } from '~/db/schema';
import { eq, inArray } from 'drizzle-orm';

// Get pack details from the database
export async function getPackDetails(packId: string) {
  const packData = await db.query.packs.findFirst({
    where: eq(packs.id, Number.parseInt(packId)),
    with: {
      items: {
        with: {
          catalogItem: true,
        },
      },
      user: true,
    },
  });

  return packData;
}

// Get item details from the database
export async function getItemDetails(itemId: string) {
  // First try to find it as a pack item
  const packItem = await db.query.packItems.findFirst({
    where: eq(packItems.id, Number.parseInt(itemId)),
    with: {
      catalogItem: true,
    },
  });

  if (packItem) return packItem;

  // If not found, try to find it as a catalog item
  const catalogItem = await db.query.catalogItems.findFirst({
    where: eq(catalogItems.id, Number.parseInt(itemId)),
  });

  return catalogItem;
}

// Get user details
export async function getUserDetails(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, Number.parseInt(userId)),
  });
}

// Get catalog items from the database
export async function getCatalogItems(options?: {
  categories?: string[];
  ids?: number[];
  limit?: number;
}) {
  let query = db.select().from(catalogItems);

  if (options?.categories?.length) {
    query = query.where(inArray(catalogItems.category, options.categories));
  }

  if (options?.ids?.length) {
    query = query.where(inArray(catalogItems.id, options.ids));
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query;
}
