import { describe, test, expect } from 'vitest';
import makeViewport from './viewport';

describe('viewport', () => {
  const canvas = {
    width: 2,
    height: 1,
  };

  const vp = makeViewport(canvas, 100);

  const expectDimensions = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    expect(vp.width).toBe(width);
    expect(vp.height).toBe(height);
    expect(vp.vMin).toBe(Math.min(width, height));
    expect(vp.vMax).toBe(Math.max(width, height));
  };

  test('left, right, top, bottom', () => {
    expect(vp.left).toBe(-100);
    expect(vp.right).toBe(100);
    expect(vp.top).toBe(-50);
    expect(vp.bottom).toBe(50);
  });

  test('initial dimensions', () => {
    expectDimensions({ width: 200, height: 100 });
  });

  test('setting vMin', () => {
    vp.vMin = 200;
    expectDimensions({ width: 400, height: 200 });
  });

  test('setting vMax', () => {
    vp.vMax = 100;
    expectDimensions({ width: 100, height: 50 });
  });

  test('setting width', () => {
    vp.width = 300;
    expectDimensions({ width: 300, height: 150 });
  });

  test('setting height', () => {
    vp.height = 500;
    expectDimensions({ width: 1000, height: 500 });
  });

  test('resize', () => {
    canvas.height = 8;
    vp.resize();
    expectDimensions({ width: 500, height: 2000 });
    canvas.width = 16;
    vp.resize();
    expectDimensions({ width: 1000, height: 500 });
    canvas.height = 2;
    vp.resize();
    expectDimensions({ width: 4000, height: 500 });
  });
});
