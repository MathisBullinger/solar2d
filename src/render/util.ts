export const hexColor = (r: number, g: number, b: number, a = 0xff) =>
  `#${[r, g, b, a].map(hex2).join('')}`;

const hex2 = (n: number) => Math.floor(n).toString(16).padStart(2, '0');

export const timed = <T extends (...args: any[]) => any>(fn: T): Timed<T> => {
  let last: number | null = null;

  return Object.defineProperties(
    (...args: any[]) => {
      const res = fn(...args);
      last = performance.now();
      return res;
    },
    {
      last: {
        get: () => last,
      },
      dtMs: {
        get: () => (last === null ? Infinity : performance.now() - last),
      },
    }
  ) as any;
};

type Timed<T> = T & { last: number | null; dtMs: number };
