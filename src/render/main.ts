import makeViewport from './viewport';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

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

const vp = makeViewport(canvas, 100);

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const pinch = e.ctrlKey;

  if (!pinch) {
    vp.x += (e.deltaX / vp.vMin) * 10;
    vp.y += (e.deltaY / vp.vMin) * 10;
  } else {
    vp.vMin *= 1 + e.deltaY / 100;
  }
});

type Body = {
  radius: number;
  x: number;
  y: number;
};

export const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBody({ x: 0, y: 0, radius: 50 });
};

const renderBody = (body: Body) => {
  ctx.fillStyle = '#fff';
  ctx.beginPath();

  const x = (0.5 + (body.x - vp.x) / vp.width) * canvas.width;
  const y = (0.5 + (body.y - vp.y) / vp.height) * canvas.height;
  const scale = Math.min(canvas.width, canvas.height);

  ctx.arc(x, y, (body.radius / vp.vMin) * scale, 0, 2 * Math.PI);
  ctx.fill();
};
