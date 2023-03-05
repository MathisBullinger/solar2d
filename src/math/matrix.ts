import Vector from './vector';
import { Add, Multiply, Tuple } from './types';

type MatrixMultiply<R extends number, C extends number> = {
  (vec: Vector<C>): Vector<R>;
  <C2 extends number>(matrix: Matrix<C, C2>): Matrix<R, C2>;
};

export default class Matrix<R extends number, C extends number> {
  constructor(
    public readonly rows: R,
    public readonly columns: C,
    public readonly values: Tuple<Multiply<R, C>>
  ) {}

  public mul: MatrixMultiply<R, C> = (rhs: any) =>
    (rhs instanceof Matrix ? this.mulMat : this.mulVec).call(this, rhs);

  public mulVec(vec: Vector<C>): Vector<R> {
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

  public static identity<T extends number>(size: T): Matrix<T, T> {
    const values = Array(size ** 2).fill(0);
    for (let i = 0; i < size; i++) values[i * size + i] = 1;
    return new Matrix(size, size, values as any);
  }

  public static translate<T extends Vector>(translation: T): Transformation<T> {
    const dimensions = translation.components.length;
    const result = Matrix.identity(dimensions + 1) as Transformation<T>;
    for (let i = 0; i < dimensions; i++)
      result.values[i * (dimensions + 1) + dimensions] =
        translation.components[i] ?? 0;
    return result;
  }

  public static scale<T extends Vector>(scale: T): Transformation<T> {
    const dimensions = scale.components.length;
    const result = Matrix.identity(dimensions + 1) as Transformation<T>;
    for (let i = 0; i < dimensions; i++)
      result.values[i * (dimensions + 1) + i] = scale.components[i] ?? 0;
    return result;
  }
}

type Transformation<T extends Vector<number>> = T extends Vector<infer I>
  ? Matrix<Add<I, 1>, Add<I, 1>>
  : never;
