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
// Expanded to include missing categories ("water sports" and "skiing")
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

// --- Weight Unit Enum ---
export const WeightUnitSchema = z.enum(['g', 'oz', 'kg', 'lb']);

export type WeightUnit = z.infer<typeof WeightUnitSchema>;

// --- Pack Item Schema ---
// If needed, you can also create an enum for pack item categories.
export const PackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  weight: z.number().nonnegative(),
  weightUnit: WeightUnitSchema,
  quantity: z.number().int().positive(),
  category: z.string(), // Consider defining an enum if this field becomes standardized.
  consumable: z.boolean(),
  worn: z.boolean(),
  image: z.string().url().optional(),
  notes: z.string().optional(),
  packId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PackItem = z.infer<typeof PackItemSchema>;

// --- Pack Schema ---
export const PackSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: PackCategorySchema,
  baseWeight: z.number().nonnegative().optional(), // Weight without consumables
  totalWeight: z.number().nonnegative().optional(), // Total weight including consumables
  items: z.array(PackItemSchema),
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
export const PackItemsArraySchema = z.array(PackItemSchema);
