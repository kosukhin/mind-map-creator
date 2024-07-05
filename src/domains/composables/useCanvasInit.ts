import { canvas } from '@/domains/data/canvas';
import { watch } from 'vue';
import { canvasSize } from '@/domains/data/canvasSize';

export const useCanvasInit = () => {
  watch(canvas, () => {
    canvasSize.value = {
      w: canvas.value?.clientWidth ?? 0,
      h: canvas.value?.clientHeight ?? 0,
    };
  });
};
