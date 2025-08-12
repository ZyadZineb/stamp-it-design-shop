import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BarProps {
  id: string;
  label: string;
  unit?: 'mm' | '°';
  min: number; // in unit
  max: number; // in unit
  step?: number; // in unit
  value: number; // in unit
  onChange: (val: number) => void;
  format?: (v:number)=>string; // optional label formatter
}

export default function Bar({ id, label, unit='mm', min, max, step=0.5, value, onChange, format }: BarProps){
  const [local, setLocal] = React.useState<number>(value);
  React.useEffect(()=> setLocal(value), [value]);
  const fmt = (v:number)=> format? format(v) : `${v.toFixed(unit==='mm'?1:0)} ${unit}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <span className="text-xs text-muted-foreground tabularnums">{fmt(local)}</span>
      </div>
      <div className="flex items-center gap-3">
        <Slider id={id} value={[local]} min={min} max={max} step={step}
          onValueChange={(v)=> setLocal(v[0])}
          onValueCommit={(v)=> onChange(+v[0])}
          className="flex-1"/>
        <Input aria-label={`${label} ${unit}`} inputMode="decimal"
          value={Number.isFinite(local) ? local : ''}
          onChange={(e)=>{ const n = Number(e.target.value); if(!Number.isNaN(n)) setLocal(n); }}
          onBlur={()=> onChange(+local)} className="w-20"/>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
