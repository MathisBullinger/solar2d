import { describe, test, expect } from 'vitest';
import Vector from './vector';

describe('Vector', () => {
  test('add', () => {
    expect(new Vector<2>(1, 2).add(new Vector<2>(3, 4))).toMatchObject({
      x: 4,
      y: 6,
    });
    expect(new Vector<2>(1, 2).add(3, 4)).toMatchObject({
      x: 4,
      y: 6,
    });
    expect(new Vector<2>(1, 2).add(3)).toMatchObject({ x: 4, y: 5 });
  });

  test('resize', () => {
    expect(new Vector<3>(1, 2, 3).resize(2).components).toEqual([1, 2]);
    expect(new Vector<1>(1).resize(3, 2, 3).components).toEqual([1, 2, 3]);
  });
});
