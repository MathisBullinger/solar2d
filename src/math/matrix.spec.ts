import { describe, test, expect } from 'vitest';
import Matrix from './matrix';
import Vector from './vector';

describe('Matrix', () => {
  test('matrix vector multiplication', () => {
    expect(
      new Matrix(2, 3, [1, -1, 2, 0, -3, 1]).mul(new Vector<3>(2, 1, 0))
        .components
    ).toEqual([1, -3]);
  });

  test('matrix matrix multiplication', () => {
    {
      const a = new Matrix(2, 2, [1, 7, 2, 4]);
      const b = new Matrix(2, 2, [3, 3, 5, 2]);
      const c = a.mulMat(b);
      expect(c.values).toEqual([38, 17, 26, 14]);
    }
    {
      const a = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
      const b = new Matrix(3, 2, [7, 8, 9, 10, 11, 12]);
      const c = a.mulMat(b);
      expect(c.values).toEqual([58, 64, 139, 154]);
    }
  });
});
