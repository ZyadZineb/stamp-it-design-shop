import type { GlyphPose } from '@/engine/curvedText';

interface DrawOptions {
  font: string; // canvas font string e.g. "italic bold 16px Arial"
  fillStyle: string;
}

export function drawCurvedText(ctx: CanvasRenderingContext2D, poses: GlyphPose[], opts: DrawOptions) {
  ctx.save();
  ctx.font = opts.font;
  ctx.fillStyle = opts.fillStyle;

  for (const g of poses) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angleRad);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(g.char, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}
