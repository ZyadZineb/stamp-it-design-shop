import { z } from 'zod';
import { ProductSchema } from '@/schemas/product';

export async function loadProducts() {
  const res = await fetch('/models/products.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load products.json: ${res.status}`);
  const data = await res.json();
  return z.array(ProductSchema).parse(data);
}
