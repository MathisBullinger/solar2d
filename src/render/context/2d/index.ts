import type { Viewport } from '../../viewport';
import { color } from '../../../util';
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

  const renderSystem = (body: Body, transform: Matrix<3, 3>) => {
    const screenGraph = buildScreenGraph(body, transform);
    renderScreenGraph(screenGraph);
  };

  type ScreenGraph = {
    body: Body;
    position: Vector<2>;
    radius: number;
    parent: ScreenGraph | null;
    children?: ScreenGraph[];
  };

  const buildScreenGraph = (
    body: Body,
    screenSpaceTransform: Matrix<3, 3>,
    parent: ScreenGraph | null = null
  ): ScreenGraph => {
    const position = screenSpaceTransform
      .mul(body.getRelativePosition().resize(3, 1))
      .resize(2);

    const scale = Math.min(canvas.width, canvas.height);
    const radius = (body.radius / vp.vMin) * scale;

    const node: ScreenGraph = {
      body,
      position,
      radius,
      parent,
    };

    node.children = [...body.children].map((child) =>
      buildScreenGraph(child, screenSpaceTransform, node)
    );

    return node;
  };

  const renderScreenGraph = (node: ScreenGraph) => {
    if (node.parent) {
      renderOrbit(
        node.parent.position,
        (node.body.semiMajorAxis / vp.width) * canvas.width
      );
    }

    if (node.radius > 1) renderBodyShape(node.position, node.radius);
    if (node.radius < 3) renderBodyTarget(node.position);

    node.children?.forEach(renderScreenGraph);
  };

  const renderBodyShape = ({ x, y }: Vector<2>, radius: number) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const renderBodyTarget = ({ x, y }: Vector<2>) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const renderOrbit = ({ x, y }: Vector<2>, radius: number) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#888';
    ctx.beginPath();
    const off = 0.02;
    ctx.arc(x, y, radius, off * Math.PI, (2 - off) * Math.PI);
    ctx.stroke();
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

  return { render };
};
