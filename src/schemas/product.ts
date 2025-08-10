import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  model: z.string(),
  price: z.number(),
  size: z.string(), // e.g., "38x14mm" or "32mm"
  lines: z.number().int().nonnegative(),
  colors: z.array(z.string()),
  inkColors: z.array(z.string()),
  images: z.array(z.string()),
  description: z.string(),
  featured: z.boolean().optional(),
  shape: z.enum(['rectangle', 'circle', 'square', 'ellipse']),
});

export type ProductRecord = z.infer<typeof ProductSchema>;
