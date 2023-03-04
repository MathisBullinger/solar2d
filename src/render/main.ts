import makeViewport from './viewport';
import createContext from './context';
import rootBody, { Body } from '../system';
import * as constants from './constants';
import Vector from '../math/vector';
import { timed } from './util';

const canvas = document.querySelector('canvas')!;

{
  const setCanvasSize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  };

  setCanvasSize();
  window.addEventListener('resize', () => {
    setCanvasSize();
    vp.resize();
  });
}

const vp = makeViewport(canvas, rootBody.radius * 4);

const pan = timed((dPx: Vector) => {
  const offset = dPx.mul(constants.SCALE_PAN * vp.vMin);
  vp.x += offset.x;
  vp.y += offset.y;
});

const zoom = timed((dPx: number, { x, y } = new Vector(0.5, 0.5)) => {
  const dz = dPx * constants.SCALE_ZOOM + 1;
  vp.x += (x - 0.5) * (vp.width - dz * vp.width);
  vp.y += (y - 0.5) * (vp.width - dz * vp.width);
  vp.vMin *= dz;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const pinch = e.ctrlKey;

  if (pinch) {
    zoom(
      e.deltaY,
      new Vector(e.clientX, e.clientY)
        .div(canvas.width, canvas.height)
        .mul(devicePixelRatio)
    );
  } else {
    pan(new Vector(e.deltaX, e.deltaY));
  }
});

canvas.addEventListener('pointerdown', () => {
  const onMove = (e: PointerEvent) => {
    pan(new Vector(e.movementX, e.movementY).mul(-devicePixelRatio));
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

const ctx = createContext(canvas, vp);

export const render = (dtMs: number) => {
  ctx.clear();
  renderGrid();
  renderSystem(rootBody);
};

const renderGrid = () => {
  const dt = Math.min(zoom.dtMs, pan.dtMs);
  if (dt > constants.GRID_MAX_MS) return;
  const opacity =
    dt < constants.GRID_MAX_MS * 0.75
      ? 1
      : 1 -
        (dt - constants.GRID_MAX_MS * 0.75) / (constants.GRID_MAX_MS * 0.25);
  ctx.renderGrid(opacity ** 2 * 0x77);
};

const renderSystem = (body: Body) => {
  ctx.renderBody(body);
  body.children.forEach(renderSystem);
};
