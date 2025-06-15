
import { describe, it, expect } from 'vitest';
import { usePreviewLayout } from '../usePreviewLayout';
import { renderHook } from '@testing-library/react';

describe('usePreviewLayout', () => {
  it('returns correct pixel sizes and line heights', () => {
    const lines = [
      { fontSize: 16 },
      { fontSize: 20, curved: true }
    ];
    const { result } = renderHook(() =>
      usePreviewLayout({ widthMm: 20, heightMm: 10, lines })
    );
    expect(result.current.widthPx).toBe(200);
    expect(result.current.heightPx).toBe(100);
    expect(result.current.lineHeightsPx[0]).toBe(16);
    expect(result.current.lineHeightsPx[1]).toBe(20);
  });

  it('applies fontScale', () => {
    const lines = [{ fontSize: 10 }, { fontSize: 20 }];
    const { result } = renderHook(() =>
      usePreviewLayout({ widthMm: 5, heightMm: 2, lines, fontScale: 2 })
    );
    expect(result.current.lineHeightsPx).toEqual([20, 40]);
  });
});
