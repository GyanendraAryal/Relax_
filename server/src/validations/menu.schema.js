import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});

const booleanPreprocess = z.preprocess(
  (val) => val === 'true' || val === true,
  z.boolean()
).optional();

export const menuItemSchema = z.object({
  category_id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  image_url: z.string().url().optional().nullable(),
  is_vegetarian: booleanPreprocess,
  is_spicy: booleanPreprocess,
  is_available: booleanPreprocess,
  is_featured: booleanPreprocess,
  sort_order: z.coerce.number().int().optional(),
});
