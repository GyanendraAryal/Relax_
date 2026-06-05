import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const menuItemSchema = z.object({
  category_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  image_url: z.string().url().optional().nullable(),
  is_vegetarian: z.boolean().optional(),
  is_spicy: z.boolean().optional(),
  is_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});
