import makeViewport from './viewport';
import createContext from './context';
import rootBody, { Body } from '../system';
import * as constants from './constants';
import Vector from '../math/vector';

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

const pan = (dPx: Vector) => {
  const offset = dPx.times(constants.SCALE_PAN * vp.vMin);
  vp.x += offset.x;
  vp.y += offset.y;
};

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const pinch = e.ctrlKey;

  if (pinch) {
    const targetX = (e.clientX / canvas.width) * devicePixelRatio;
    const targetY = (e.clientY / canvas.height) * devicePixelRatio;
    const dz = e.deltaY * constants.SCALE_ZOOM + 1;
    vp.x += (targetX - 0.5) * (vp.width - dz * vp.width);
    vp.y += (targetY - 0.5) * (vp.height - dz * vp.height);
    vp.vMin *= dz;
  } else {
    pan(new Vector(e.deltaX, e.deltaY));
  }
});

canvas.addEventListener('pointerdown', () => {
  const onMove = (e: PointerEvent) => {
    pan(new Vector(e.movementX, e.movementY).times(-devicePixelRatio));
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

export const render = () => {
  ctx.clear();
  ctx.renderGrid();
  renderSystem(rootBody);
};

const renderSystem = (body: Body) => {
  ctx.renderBody(body);
  body.children.forEach(renderSystem);
};
