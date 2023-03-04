const { sin, cos, PI, sqrt } = Math;

export const inSine = (x: number) => 1 - cos((x * PI) / 2);
export const outSine = (x: number) => sin((x * PI) / 2);
export const inOutSine = (x: number) => -(cos(PI * x) - 1) / 2;

export const inQuad = (x: number) => x ** 2;
export const outQuad = (x: number) => 1 - (1 - x) ** 2;
export const inOutQuad = (x: number) =>
  x < 0.5 ? 2 * x ** 2 : 1 - (-2 * x + 2) ** 2 / 2;

export const inCubic = (x: number) => x ** 3;
export const outCubic = (x: number) => 1 - (1 - x) ** 3;
export const inOutCubic = (x: number) =>
  x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;

export const inQuart = (x: number) => x ** 4;
export const outQuart = (x: number) => 1 - (1 - x) ** 4;
export const inOutQuart = (x: number) =>
  x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;

export const inQuint = (x: number) => x ** 5;
export const outQuint = (x: number) => 1 - (1 - x) ** 5;
export const inOutQuint = (x: number) =>
  x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;

export const inExpo = (x: number) => (x === 0 ? 0 : 2 ** (10 * x - 10));
export const outExpo = (x: number) => (x === 1 ? 1 : 1 - 2 ** (-10 * x));
export const inOutExpo = (x: number) =>
  x === 0 || x === 1
    ? x
    : x < 0.5
    ? 2 ** (20 * x - 10) / 2
    : (2 - 2 ** (-20 * x + 10)) / 2;

export const inCirc = (x: number) => 1 - sqrt(1 - x ** 2);
export const outCirc = (x: number) => sqrt(1 - (x - 1) ** 2);
export const inOutCirc = (x: number) =>
  x < 0.5
    ? (1 - sqrt(1 - (2 * x) ** 2)) / 2
    : (sqrt(1 - (-2 * x + 2) ** 2) + 1) / 2;

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

export const inBack = (x: number) => c3 * x ** 3 - c1 * x ** 2;
export const outBack = (x: number) => 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
export const inOutBack = (x: number) =>
  x < 0.5
    ? ((2 * x) ** 2 * ((c2 + 1) * 2 * x - c2)) / 2
    : ((2 * x - 2) ** 2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;

export const inElastic = (x: number) =>
  x === 0
    ? 0
    : x === 1
    ? 1
    : -(2 ** (10 * x - 10)) * sin((x * 10 - 10.75) * c4);
export const outElastic = (x: number) =>
  x === 0 ? 0 : x === 1 ? 1 : 2 ** (-10 * x) * sin((x * 10 - 0.75) * c4) + 1;
export const inOutElastic = (x: number) =>
  x === 0 || x === 1
    ? x
    : x < 0.5
    ? -(2 ** (20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (2 ** (-20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;

export const inBounce = (x: number) => 1 - outBounce(1 - x);
export function outBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  return x < 1 / d1
    ? n1 * x * x
    : x < 2 / d1
    ? n1 * (x -= 1.5 / d1) * x + 0.75
    : x < 2.5 / d1
    ? n1 * (x -= 2.25 / d1) * x + 0.9375
    : n1 * (x -= 2.625 / d1) * x + 0.984375;
}
export const inOutBounce = (x: number) =>
  x < 0.5 ? (1 - outBounce(1 - 2 * x)) / 2 : (1 + outBounce(2 * x - 1)) / 2;
