import React from 'react';

export default function DesignerOverlay({ cx, cy, r, widthPx, heightPx, show }:{cx:number; cy:number; r:number; widthPx:number; heightPx:number; show:boolean;}){
  if(!show) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#00f" strokeDasharray="4 4" />
      <rect x={10} y={10} width={widthPx-20} height={heightPx-20} fill="none" stroke="#0a0" strokeDasharray="2 2" />
      <circle cx={cx} cy={cy} r={2} fill="#f00" />
    </g>
  );
}
