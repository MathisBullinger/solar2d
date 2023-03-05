import { Tuple, Subtract } from './types';

type ComponentWise<T, N extends number> = {
  (n: number): T;
  (...components: Tuple<N>): T;
  (rhs: Vector<N>): T;
};

const opFactory = <T extends number>(lhs: Vector<T>) => ({
  componentWise:
    (
      cb: (left: number, right: number) => number
    ): ComponentWise<Vector<T>, T> =>
    (...args: any[]) => {
      const rhs = args[0] instanceof Vector ? args[0].components : args;
      return new (Vector as any)(
        ...(lhs.components.map((v, i) => cb(v, rhs[i] ?? rhs[0])) as [
          number,
          number
        ])
      );
    },
});

export default class Vector<T extends number = any> {
  private op = opFactory<T>(this);
  public readonly components: number[];

  constructor(...values: Tuple<T>) {
    this.components = values;
    this.add = this.add.bind(this);
  }

  public add = this.op.componentWise((a, b) => a + b);
  public sub = this.op.componentWise((a, b) => a - b);
  public mul = this.op.componentWise((a, b) => a * b);
  public div = this.op.componentWise((a, b) => a / b);
  public exp = this.op.componentWise((a, b) => a ** b);

  public resize<N extends number>(
    length: N,
    ...components: Tuple<Subtract<N, T>>
  ): Vector<N> {
    if (length <= this.components.length)
      return new Vector<N>(...(this.components.slice(0, length) as Tuple<N>));

    return new (Vector as any)(
      ...[...this.components, ...(components as any[])].slice(0, length)
    );
  }

  public get x() {
    return this.components[0];
  }
  public get y() {
    return this.components[1];
  }
  public get z() {
    return this.components[2];
  }
}
