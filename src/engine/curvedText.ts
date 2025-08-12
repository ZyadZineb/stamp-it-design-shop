export type ArcAlign = 'center'|'start'|'end';
export type ArcDirection = 'outside'|'inside';

export interface ArcLayoutInput {
  text: string;
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontSizePx: number;
  letterSpacingPx?: number;
  radiusPx: number;
  arcDegrees: number;
  align: ArcAlign;
  direction: ArcDirection;
  centerX: number;
  centerY: number;
  rotationDeg?: number;
}

export interface GlyphPose { char: string; x: number; y: number; angleRad: number; }

const rotPt = (x: number, y: number, cx: number, cy: number, a: number) => {
  const s = Math.sin(a), c = Math.cos(a);
  const dx = x - cx, dy = y - cy;
  return { x: cx + dx * c - dy * s, y: cy + dx * s + dy * c };
};

function meas(font: string) {
  const c = document.createElement('canvas');
  const k = c.getContext('2d');
  if (!k) throw new Error('2D');
  k.font = font;
  return k;
}

export function layoutArc(i: ArcLayoutInput): GlyphPose[] {
  const text = (i.text ?? '').toString();
  if (!text) return [];

  const fs = Math.max(0.1, +i.fontSizePx || 0);
  const ls = Number.isFinite(i.letterSpacingPx as number) ? (i.letterSpacingPx as number) : 0;
  const r = Math.max(0.1, +i.radiusPx || 0);
  const arcDeg = Number.isFinite(+i.arcDegrees) ? +i.arcDegrees : 120;
  const cx = Number.isFinite(+i.centerX) ? +i.centerX : 0;
  const cy = Number.isFinite(+i.centerY) ? +i.centerY : 0;
  const rot = ((i.rotationDeg || 0) * Math.PI) / 180;

  const font = `${i.fontStyle || 'normal'} ${i.fontWeight || 400} ${fs}px ${i.fontFamily}`;
  const ctx = meas(font);

  const adv = [...text].map(ch => ctx.measureText(ch).width + ls);
  const total = adv.reduce((a, b) => a + b, 0);
  const arcRad = (arcDeg * Math.PI) / 180;
  const arcLen = Math.max(0.001, r * arcRad);

  let scale = 1;
  if (total > arcLen) {
    const letters = adv.length;
    const space = ls * letters;
    if (space > 0) {
      const target = arcLen - (total - space);
      scale = Math.max(0, target / space);
    }
  }

  const scaled = adv.map(a => a - ls + ls * scale);
  const totalScaled = scaled.reduce((a, b) => a + b, 0);

  const dir = (i.direction === 'inside') ? -1 : 1;
  let sweep = totalScaled / r;
  let start = -sweep / 2;
  if (i.align === 'start') start = 0;
  if (i.align === 'end') start = -sweep;
  start += ((arcRad - sweep) / 2);

  const poses: GlyphPose[] = [];
  let t = start;
  for (let k = 0; k < scaled.length; k++) {
    const half = (scaled[k] / r) / 2;
    t += half;
    const x = cx + Math.cos(t) * r * dir;
    const y = cy + Math.sin(t) * r * dir;
    const a = t + (dir === 1 ? Math.PI / 2 : -Math.PI / 2);
    const p = rotPt(x, y, cx, cy, rot);
    poses.push({ char: text[k], x: p.x, y: p.y, angleRad: a + rot });
    t += half;
  }

  return poses;
}
