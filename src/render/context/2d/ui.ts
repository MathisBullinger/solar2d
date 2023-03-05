import * as constants from '../../constants';
import { ease } from '../../../util';

export const fading = (cb: (opacity: number) => void) => {
  const fadeInDuration = constants.GRID_MAX_MS * 0.1;
  const fadeOutDuration = constants.GRID_MAX_MS * 0.25;

  let visible = false;
  let startShow = 0;
  let startHide = 0;

  return (show: boolean) => {
    if (show && !visible) {
      startShow = performance.now();
      visible = true;
    }

    if (!show && visible) {
      startHide = performance.now();
      visible = false;
    }

    const dt = performance.now() - (show ? startShow : startHide);

    let opacity = 1;

    if (!show && dt >= fadeOutDuration) return;

    if (show && dt < fadeInDuration)
      opacity = ease.outQuad(dt / fadeInDuration);
    else if (!show && dt < fadeOutDuration)
      opacity = ease.outQuad(1 - dt / fadeOutDuration);

    cb(opacity);
  };
};
