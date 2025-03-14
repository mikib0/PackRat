import { z } from 'zod';

// --- User Schema ---
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  experience: z.enum(['beginner', 'intermediate', 'expert']),
  joinedAt: z.string().datetime(),
  bio: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// --- Pack Category Enum ---
export const PackCategorySchema = z.enum([
  'hiking',
  'backpacking',
  'camping',
  'climbing',
  'winter',
  'desert',
  'custom',
  'water sports',
  'skiing',
]);

export type PackCategory = z.infer<typeof PackCategorySchema>;

// --- Item Category Enum ---
export const ItemCategorySchema = z.enum([
  'clothing',
  'shelter',
  'sleep',
  'kitchen',
  'water',
  'electronics',
  'first-aid',
  'navigation',
  'tools',
  'consumables',
  'miscellaneous',
]);

export type ItemCategory = z.infer<typeof ItemCategorySchema>;

// --- Weight Unit Enum ---
export const WeightUnitSchema = z.enum(['g', 'oz', 'kg', 'lb']);

export type WeightUnit = z.infer<typeof WeightUnitSchema>;

// --- Catalog Item Schema ---
export const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  defaultWeight: z.number().nonnegative(),
  weightUnit: WeightUnitSchema,
  category: z.string(),
  image: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Optional computed field for UI display
  usageCount: z.number().int().nonnegative().optional(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

// --- Pack Item Schema ---
export const PackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  weight: z.number().nonnegative(),
  weightUnit: WeightUnitSchema,
  quantity: z.number().int().positive(),
  category: z.string(),
  consumable: z.boolean(),
  worn: z.boolean(),
  image: z.string().url().optional(),
  notes: z.string().optional(),
  packId: z.string(),
  catalogItemId: z.string().optional(), // Reference to original catalog item
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string(),
});

export type PackItem = z.infer<typeof PackItemSchema>;

// --- Pack Schema ---
export const PackSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: PackCategorySchema,
  baseWeight: z.number().nonnegative().optional(), // Weight without consumables (computed)
  totalWeight: z.number().nonnegative().optional(), // Total weight including consumables (computed)
  items: z.array(PackItemSchema).optional(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isPublic: z.boolean(),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export type Pack = z.infer<typeof PackSchema>;

// --- Arrays for Mock Data Validation ---
export const UsersArraySchema = z.array(UserSchema);
export const PacksArraySchema = z.array(PackSchema);
export const CatalogItemsArraySchema = z.array(CatalogItemSchema);
export const PackItemsArraySchema = z.array(PackItemSchema);
