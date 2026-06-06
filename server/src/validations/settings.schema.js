import { z } from 'zod';

export const settingsUpdateSchema = z.object({
  restaurant: z.record(z.unknown()).optional(),
  hero: z.record(z.unknown()).optional(),
  about: z.record(z.unknown()).optional(),
  story: z.record(z.unknown()).optional(),
  google: z.record(z.unknown()).optional(),
});

export const settingKeySchema = z.object({
  key: z.enum(['restaurant', 'hero', 'about', 'story', 'google']),
});
