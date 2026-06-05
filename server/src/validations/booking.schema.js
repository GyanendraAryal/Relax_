import { z } from 'zod';

export const birthdayRequestSchema = z.object({
  customer_name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().min(7).max(50),
  event_date: z.string().date(),
  guest_count: z.coerce.number().int().min(1).max(500),
  package_type: z.string().max(100).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

export const eventRequestSchema = z.object({
  customer_name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().min(7).max(50),
  event_type: z.string().min(2).max(100),
  event_date: z.string().date(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  guest_count: z.coerce.number().int().min(1).max(1000),
  budget_range: z.string().max(100).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'declined', 'completed']),
  admin_notes: z.string().max(2000).optional().nullable(),
});
