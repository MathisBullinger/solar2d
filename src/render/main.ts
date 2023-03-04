import makeViewport from './viewport';
import createContext from './context';
import rootBody, { Body } from '../system';
import * as constants from './constants';

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
    vp.x += e.deltaX * constants.SCALE_PAN * vp.vMin;
    vp.y += e.deltaY * constants.SCALE_PAN * vp.vMin;
  }
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
