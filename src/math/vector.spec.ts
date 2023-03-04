import { describe, test, expect } from 'vitest';
import Vector from './vector';

describe('Vector', () => {
  test('add', () => {
    expect(new Vector(1, 2).add(new Vector(3, 4))).toMatchObject({
      x: 4,
      y: 6,
    });
    expect(new Vector(1, 2).add(3, 4)).toMatchObject({
      x: 4,
      y: 6,
    });
    expect(new Vector(1, 2).add(3)).toMatchObject({ x: 4, y: 5 });
  });
});
