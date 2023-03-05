import Vector from './vector';
import { Multiply, Tuple } from './types';

export default class Matrix<R extends number, C extends number> {
  constructor(
    public readonly rows: R,
    public readonly columns: C,
    public readonly values: Tuple<Multiply<R, C>>
  ) {}

  public mul(vec: Vector<C>): Vector<R> {
    const comps = [...Array(this.rows)].map((_, r) =>
      vec.components
        .map((v, c) => v * this.values[r * this.columns + c])
        .reduce((a, c) => a + c, 0)
    );

    return new (Vector as any)(...comps);
  }

  public mulMat<C2 extends number>(matrix: Matrix<C, C2>): Matrix<R, C2> {
    const values: number[] = [];

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < matrix.columns; column++) {
        let value = 0;
        for (let i = 0; i < this.columns; i++) {
          value +=
            this.values[row * this.columns + i] *
            matrix.values[i * matrix.columns + column];
        }
        values.push(value);
      }
    }

    return new Matrix(this.rows, matrix.columns, values as any);
  }
}
