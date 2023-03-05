import makeViewport from './viewport';

const canvas = document.querySelector('canvas')!;

export const vp = makeViewport(canvas, 25000);
