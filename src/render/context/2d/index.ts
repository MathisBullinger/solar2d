import type { Viewport } from '../../viewport';
import { color, ease } from '../../../util';
import { Body } from '../../../system';
import Vector from '../../../math/vector';
import Matrix from '../../../math/matrix';
import * as constants from '../../constants';
import { pan, zoom } from '../../../interaction';
import * as ui from './ui';

export type Scene = {
  rootBody: Body;
};

export default (canvas: HTMLCanvasElement, vp: Viewport, scene: Scene) => {
  const ctx = canvas.getContext('2d', { desynchronized: true })!;

  const render = () => {
    const translation = new Vector<2>(-vp.left, -vp.top)
      .div(vp.width, vp.height)
      .mul(canvas.width, canvas.height);

    const scale = new Vector<2>(canvas.width, canvas.height).div(
      vp.width,
      vp.height
    );

    const transformation = Matrix.translate(translation).mul(
      Matrix.scale(scale)
    );

    clear();
    renderGrid(Math.min(pan.dtMs, zoom.dtMs) < constants.GRID_MAX_MS);
    renderSystem(scene.rootBody, transformation);
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderGrid = ui.fading((opacityMultiplier) => {
    const opacityMajor = 0x44 * opacityMultiplier;

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
  });

  const screenSpace = (pos: Vector<2>) =>
    pos
      .sub(vp.x, vp.y)
      .div(vp.width, vp.height)
      .add(0.5)
      .mul(canvas.width, canvas.height);

  const renderSystem = (body: Body, transform: Matrix<3, 3>) => {
    renderBody(body, transform);
    body.children.forEach((child) => renderSystem(child, transform));
  };

  const renderBody = (body: Body, transform: Matrix<3, 3>) => {
    const scale = Math.min(canvas.width, canvas.height);
    const radiusPx = (body.radius / vp.vMin) * scale;

    const { x, y } = transform.mul(body.getRelativePosition().resize(3, 1));

    if (body.parent) {
      const center = screenSpace(body.parent.getRelativePosition());
      renderOrbit(
        center.x,
        center.y,
        (body.semiMajorAxis / vp.width) * canvas.width
      );
    }

    if (radiusPx > 1) renderBodyShape(x, y, radiusPx);
    if (radiusPx < 3) {
      if (!body.parent || (body.semiMajorAxis / vp.width) * canvas.width > 50)
        renderBodyTarget(x, y);
    }
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

  const renderOrbit = (x: number, y: number, radius: number) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#888';
    ctx.beginPath();
    const off = 0.02;
    ctx.arc(x, y, radius, off * Math.PI, (2 - off) * Math.PI);
    ctx.stroke();
  };

  return { render };
};
