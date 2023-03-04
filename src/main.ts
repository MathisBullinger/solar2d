import { render } from './render/main';

(() => {
  let lastRender = performance.now();

  const step = () => {
    const now = performance.now();
    const dt = lastRender - now;
    lastRender = now;

    render(dt);

    requestAnimationFrame(step);
  };

  step();
})();
