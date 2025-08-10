export type ArcAlign = 'center' | 'start' | 'end';
export type ArcDirection = 'cw' | 'ccw';

export interface LayoutArcInput {
  text: string;
  cx: number; // center x in px
  cy: number; // center y in px
  radiusPx: number; // radius in px
  arcDegrees?: number; // sweep angle, default 180
  align?: ArcAlign; // center by default
  direction?: ArcDirection; // cw (top) or ccw (bottom)
  letterSpacingPx?: number; // additional spacing between glyphs in px
  font: string; // canvas font string e.g. "bold 16px Arial"
}

export interface GlyphPose {
  char: string;
  x: number;
  y: number;
  angle: number; // radians, tangent angle for orientation
}

// Measure text using an offscreen canvas
function measureWidth(text: string, font: string): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export function layoutArc(input: LayoutArcInput): GlyphPose[] {
  const {
    text,
    cx,
    cy,
    radiusPx,
    arcDegrees = 180,
    align = 'center',
    direction = 'cw',
    letterSpacingPx = 0,
    font,
  } = input;

  const chars = Array.from(text);
  if (chars.length === 0) return [];

  // total arc length = sum of char widths + spacing
  const widths = chars.map(ch => measureWidth(ch, font));
  const totalWidth = widths.reduce((a, b) => a + b, 0) + letterSpacingPx * (chars.length - 1);

  // convert arc sweep degrees to radians and then to available arc length
  const sweepRadians = (arcDegrees * Math.PI) / 180;
  const availableArcLength = radiusPx * sweepRadians;

  // scale factor if text longer than available arc (simple fit)
  const scale = totalWidth > 0 ? Math.min(1, availableArcLength / totalWidth) : 1;

  // angle per pixel along the arc
  const anglePerPx = sweepRadians / Math.max(1, (totalWidth || 1));

  // starting angle: center the text on the arc
  let startAngle = -sweepRadians / 2; // start at left end (relative to top center)
  if (align === 'start') startAngle = -sweepRadians / 2;
  if (align === 'end') startAngle = sweepRadians / 2 - sweepRadians;

  // direction: cw draws along top arc left->right, ccw mirrors vertically
  const dir = direction === 'ccw' ? -1 : 1;

  // Place each glyph
  let cursorPx = 0;
  const poses: GlyphPose[] = [];

  for (let i = 0; i < chars.length; i++) {
    const w = widths[i] * scale;
    const advance = (w + (i > 0 ? letterSpacingPx * scale : 0));
    const midPx = cursorPx + w / 2 + (i > 0 ? letterSpacingPx * scale : 0);
    const angle = startAngle + dir * midPx * anglePerPx;

    const x = cx + radiusPx * Math.cos(angle);
    const y = cy + radiusPx * Math.sin(angle);

    // Tangent angle rotated by 90deg to orient glyph upright along path
    const tangentAngle = angle + (Math.PI / 2) * dir;

    poses.push({ char: chars[i], x, y, angle: tangentAngle });
    cursorPx += advance;
  }

  return poses;
}
