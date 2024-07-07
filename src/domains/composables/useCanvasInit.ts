import { canvas } from '@/domains/data/canvas';
import { canvasSize } from '@/domains/data/canvasSize';
import { lazyWatch } from '@/domains/vue/lazyWatch';
import { partial, set } from 'lodash';
import { placeholder } from 'lodash/fp';

export const useCanvasInit = () => {
  canvas.ap(lazyWatch((canvasElement: HTMLElement) => {
    canvasSize.ap(partial(set, placeholder, 'value', {
      w: canvasElement.clientWidth ?? 0,
      h: canvasElement.clientHeight ?? 0,
    }));
  }));
};
