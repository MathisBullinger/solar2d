export const hex = (r: number, g: number, b: number, a = 0xff) =>
  `#${[r, g, b, a].map(hex2).join('')}`;

const hex2 = (n: number) => Math.floor(n).toString(16).padStart(2, '0');
