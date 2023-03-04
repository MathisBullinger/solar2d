import makeViewport from './viewport';
import createContext from './context';
import rootBody, { Body } from '../system';

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

  if (!pinch) {
    vp.x += e.deltaX * 5e-4 * vp.vMin;
    vp.y += e.deltaY * 5e-4 * vp.vMin;
  } else {
    vp.vMin *= 1 + e.deltaY * 3e-3;
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
