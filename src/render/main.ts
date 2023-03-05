import createContext, { Scene } from './context';
import rootBody from '../system';
import { vp } from './scene';

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

const scene: Scene = { rootBody };

const ctx = createContext(canvas, vp, scene);

export const render = (dtMs: number) => {
  ctx.render();
};
