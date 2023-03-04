import systemData from '../data/system.json';

export class Body {
  public parent: Body | null = null;
  public semiMajorAxis: number;
  public children = new Set<Body>();

  constructor(public readonly name: string, public readonly radius: number) {}

  public setParent(parent: Body, semiMajorAxis: number) {
    this.parent = parent;
    this.semiMajorAxis = semiMajorAxis;
    parent.children.add(this);
  }

  public getRelativePosition(): [x: number, y: number] {
    if (!this.parent) return [0, 0];
    return [this.semiMajorAxis, 0];
  }
}

const buildSystem = (data: any, parent?: Body) => {
  const names = Object.keys(data);
  if (!parent && names.length > 1)
    throw Error("can't have more than one root body");

  const bodies = names.map((name) => {
    const body = new Body(name, data[name].radius);
    if (parent) {
      body.setParent(parent, data[name].a);
    }
    const children = data[name].children;
    if (children) buildSystem(children, body);
    return body;
  });

  return bodies[0];
};

export default buildSystem(systemData);
