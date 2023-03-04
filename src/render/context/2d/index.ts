import type { Viewport } from '../../viewport';
import { color } from '../../../util';
import { Body } from '../../../system';

export default (canvas: HTMLCanvasElement, vp: Viewport) => {
  const ctx = canvas.getContext('2d')!;

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderGrid = (opacityMajor = 0x88) => {
    const log10 = Math.log10(vp.vMin);
    const spacing = 10 ** (Math.floor(log10) - 1);
    const majorStep = spacing * 10;
    const opacityMinor = (1 - (log10 % 1)) ** 2 * opacityMajor;
    const clMajor = color.hex(0xff, 0xff, 0xff, opacityMajor);
    const clMinor = color.hex(0xff, 0xff, 0xff, opacityMinor);

    const left = vp.left;
    const right = vp.right;
    const top = vp.top;
    const bottom = vp.bottom;

    ctx.lineWidth = 1;

    for (let x = left - (left % spacing); x < right; x += spacing) {
      const screenX = ((x - left) / vp.width) * canvas.width;
      ctx.strokeStyle = x % majorStep ? clMinor : clMajor;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, canvas.height);
      ctx.stroke();
    }

    for (let y = top - (top % spacing); y < bottom; y += spacing) {
      const screenY = ((y - top) / vp.height) * canvas.height;
      ctx.strokeStyle = y % majorStep ? clMinor : clMajor;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(canvas.width, screenY);
      ctx.stroke();
    }
  };

  const renderBody = (body: Body) => {
    const scale = Math.min(canvas.width, canvas.height);
    const radiusPx = (body.radius / vp.vMin) * scale;
    const [rx, ry] = body.getRelativePosition();
    const x = (0.5 + (rx - vp.x) / vp.width) * canvas.width;
    const y = (0.5 + (ry - vp.y) / vp.height) * canvas.height;

    if (radiusPx > 1) renderBodyShape(x, y, radiusPx);
    if (radiusPx < 3) renderBodyTarget(x, y);
  };

  const renderBodyShape = (x: number, y: number, radius: number) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const renderBodyTarget = (x: number, y: number) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();
  };

  return { clear, renderGrid, renderBody };
};
