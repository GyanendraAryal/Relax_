import { z } from 'zod';

export const offerSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  discount_percent: z.coerce.number().min(0).max(100).optional().nullable(),
  discount_amount: z.coerce.number().min(0).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  valid_from: z.string().date().optional().nullable(),
  valid_until: z.string().date().optional().nullable(),
  is_active: z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : v),
    z.boolean().optional()
  ),
  terms: z.string().optional().nullable(),
});
