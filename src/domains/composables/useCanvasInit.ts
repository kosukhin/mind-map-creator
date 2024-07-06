import { canvas } from '@/domains/data/canvas';
import { watch } from 'vue';
import { canvasSize } from '@/domains/data/canvasSize';

export const useCanvasInit = () => {
  watch(canvas.value(), () => {
    canvasSize.value().value = {
      w: canvas.value().value?.clientWidth ?? 0,
      h: canvas.value().value?.clientHeight ?? 0,
    };
  });
};
