import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().max(255).optional().nullable(),
  caption: z.string().optional().nullable(),
  image_url: z.string().url().optional(),
  category: z.string().max(100).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});
