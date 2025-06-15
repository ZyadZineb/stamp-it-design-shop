
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCanvasCentering } from '../useCanvasCentering';

describe('useCanvasCentering', () => {
  const mockLine = { text: 'Test', fontSize: 16, alignment: 'center' };

  it('calculates canvas dimensions correctly', () => {
    const { result } = renderHook(() => useCanvasCentering());
    expect(result.current.getCanvasDimensions('38x14mm')).toEqual({ width: 380, height: 140 });
    expect(result.current.getCanvasDimensions('60x40mm')).toEqual({ width: 600, height: 400 });
  });

  it('calculates text bounding box for line', () => {
    const { result } = renderHook(() => useCanvasCentering());
    // Font size 20: charWidth = 12, lineHeight=24, text='abcd' => width=48, height=24
    expect(result.current.calculateTextBounds({ text: 'abcd' }, 20)).toEqual({ width: 48, height: 24 });
  });

  it('centers a single text line as a group', () => {
    const { result } = renderHook(() => useCanvasCentering());
    const lines = [{ text: 'Test', fontSize: 16, alignment: 'center' }];
    const centered = result.current.centerTextGroup(
      lines,
      100, 100,
      16,
      'center'
    );
    expect(centered[0]).toHaveProperty('xPosition');
    expect(centered[0]).toHaveProperty('yPosition');
  });

  it('computes multi-line group bounds', () => {
    const { result } = renderHook(() => useCanvasCentering());
    const lines = [
      { text: 'Hello', fontSize: 18 },
      { text: 'World', fontSize: 18 }
    ];
    const { width, height } = result.current.calculateMultiLineGroupBounds(lines, 18);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });
});
