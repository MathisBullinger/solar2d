import { describe, test, expect } from 'vitest';
import makeViewport from './viewport';

describe('viewport', () => {
  const resizeListeners: (() => void)[] = [];

  const canvas = {
    width: 2,
    height: 1,
    addEventListener(_: string, cb: () => void) {
      resizeListeners.push(cb);
    },
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
    resizeListeners.forEach((cb) => cb());
    expectDimensions({ width: 500, height: 2000 });
    canvas.width = 16;
    resizeListeners.forEach((cb) => cb());
    expectDimensions({ width: 1000, height: 500 });
    canvas.height = 2;
    resizeListeners.forEach((cb) => cb());
    expectDimensions({ width: 4000, height: 500 });
  });
});
