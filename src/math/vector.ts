type ComponentWise<T> = {
  (n: number): T;
  (x: number, y: number): T;
  (rhs: Vector): T;
};

const opFactory = (lhs: Vector) => ({
  componentWise:
    (cb: (left: number, right: number) => number): ComponentWise<Vector> =>
    (...args: any[]) => {
      const rhs = args[0] instanceof Vector ? args[0].components : args;
      return new Vector(
        ...(lhs.components.map((v, i) => cb(v, rhs[i] ?? rhs[0])) as [
          number,
          number
        ])
      );
    },
});

export default class Vector {
  private op = opFactory(this);

  constructor(public readonly x: number, public readonly y: number) {
    this.add = this.add.bind(this);
  }

  public add = this.op.componentWise((a, b) => a + b);
  public sub = this.op.componentWise((a, b) => a - b);
  public mul = this.op.componentWise((a, b) => a * b);
  public div = this.op.componentWise((a, b) => a / b);
  public exp = this.op.componentWise((a, b) => a ** b);

  public get components(): [x: number, y: number] {
    return [this.x, this.y];
  }
}
