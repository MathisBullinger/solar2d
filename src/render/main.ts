import makeViewport from './viewport';
import createContext from './context';
import rootBody, { Body } from '../system';
import * as constants from './constants';
import Vector from '../math/vector';
import { fn, ease } from '../util';

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

const pan = fn.timed((dPx: Vector) => {
  const offset = dPx.mul(constants.SCALE_PAN * vp.vMin);
  vp.x += offset.x;
  vp.y += offset.y;
});

const zoom = fn.timed((dPx: number, { x, y } = new Vector(0.5, 0.5)) => {
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

let _gridRenderStart = 0;

const renderGrid = () => {
  const dt = Math.min(zoom.dtMs, pan.dtMs);
  if (dt > constants.GRID_MAX_MS) {
    _gridRenderStart = 0;
    return;
  }

  if (!_gridRenderStart) _gridRenderStart = performance.now();
  const dtStart = performance.now() - _gridRenderStart;

  const fadeInDuration = constants.GRID_MAX_MS * 0.1;
  const fadeOutDuration = constants.GRID_MAX_MS * 0.25;

  let opacityMultiplier = 1;

  if (dtStart < fadeInDuration)
    opacityMultiplier = ease.outQuad(dtStart / fadeInDuration);
  else if (constants.GRID_MAX_MS - dt < fadeOutDuration)
    opacityMultiplier = ease.outQuad(
      1 - (dt - (constants.GRID_MAX_MS - fadeOutDuration)) / fadeOutDuration
    );

  ctx.renderGrid(opacityMultiplier * 0x77);
};

const renderSystem = (body: Body) => {
  ctx.renderBody(body);
  body.children.forEach(renderSystem);
};
