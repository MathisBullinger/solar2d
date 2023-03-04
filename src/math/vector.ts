export default class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  public times(n: number) {
    return new Vector(this.x * n, this.y * n);
  }
}
