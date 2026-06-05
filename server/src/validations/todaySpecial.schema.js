import { z } from 'zod';

export const todaySpecialSchema = z.object({
  menu_item_id: z.coerce.number().int().positive(),
  special_price: z.coerce.number().min(0).optional().nullable(),
  note: z.string().optional().nullable(),
  special_date: z.string().date(),
  is_active: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});
