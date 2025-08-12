import { sizePx } from '@/utils/dimensions';

export function rangeForProductMm(product: { size: string }){
  const { widthPx, heightPx } = sizePx(product.size);
  const widthMm = widthPx / 10; // 10 px per mm
  const heightMm = heightPx / 10;
  return { widthMm, heightMm };
}
