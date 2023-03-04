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
    vp.x += e.deltaX * 1e-3 * vp.vMin;
    vp.y += e.deltaY * 1e-3 * vp.vMin;
  } else {
    vp.vMin *= 1 + e.deltaY * 5e-3;
  }
});

type Body = {
  radius: number;
  x: number;
  y: number;
};

export const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderGrid();
  renderBody({ x: 0, y: 0, radius: 50 });
};

const renderGrid = () => {
  const log10 = Math.log10(vp.vMin);
  const spacing = 10 ** (Math.floor(log10) - 1);
  const opacity = 1 - (log10 % 1);
  const opacityHex = Math.floor(opacity * 0xff)
    .toString(16)
    .padStart(2, '0');

  const left = vp.left;
  const right = vp.right;
  const top = vp.top;
  const bottom = vp.bottom;

  const setStyle = (n: number) => {
    const isMajor = n % (spacing * 10) === 0;
    ctx.strokeStyle = isMajor ? '#fff' : `#ffffff${opacityHex}`;
  };

  for (let x = left - (left % spacing); x < right; x += spacing) {
    const screenX = ((x - left) / vp.width) * canvas.width;
    setStyle(x);
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, canvas.height);
    ctx.stroke();
  }

  for (let y = top - (top % spacing); y < bottom; y += spacing) {
    const screenY = ((y - top) / vp.height) * canvas.height;
    setStyle(y);
    ctx.beginPath();
    ctx.moveTo(0, screenY);
    ctx.lineTo(canvas.width, screenY);
    ctx.stroke();
  }
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
