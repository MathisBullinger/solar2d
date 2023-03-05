import { vp } from './render/scene';
import * as constants from './render/constants';
import { fn } from './util';
import Vector from './math/vector';

const canvas = document.querySelector('canvas')!;

export const pan = fn.timed((dPx: Vector<2>) => {
  const offset = dPx.mul(constants.SCALE_PAN * vp.vMin);
  vp.x += offset.x;
  vp.y += offset.y;
});

export const zoom = fn.timed(
  (dPx: number, { x, y } = new Vector<2>(0.5, 0.5)) => {
    const dz = dPx * constants.SCALE_ZOOM + 1;
    vp.x += (x - 0.5) * (vp.width - dz * vp.width);
    vp.y += (y - 0.5) * (vp.width - dz * vp.width);
    vp.vMin *= dz;
  }
);

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const pinch = e.ctrlKey;

  if (pinch) {
    zoom(
      e.deltaY,
      new Vector<2>(e.clientX, e.clientY)
        .div(canvas.width, canvas.height)
        .mul(devicePixelRatio)
    );
  } else {
    pan(new Vector(e.deltaX, e.deltaY));
  }
});

canvas.addEventListener('pointerdown', () => {
  const onMove = (e: PointerEvent) => {
    pan(new Vector<2>(e.movementX, e.movementY).mul(-devicePixelRatio));
  };
  window.addEventListener('pointermove', onMove);
  const cancel = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', cancel);
    window.removeEventListener('pointerout', cancel);
  };
  window.addEventListener('pointerup', cancel);
  window.addEventListener('pointerout', cancel);
});
