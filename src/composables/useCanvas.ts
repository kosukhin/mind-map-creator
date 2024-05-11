import { Size } from '@/entities/Size';
import { ref, watch } from 'vue';
import { useSessionLog } from '@/app/useSessionLog';

const canvas = ref<HTMLElement>();
const canvasSize = ref<Size>();
const { sessionLog } = useSessionLog();

watch(canvas, () => {
  canvasSize.value = {
    w: canvas.value?.clientWidth ?? 0,
    h: canvas.value?.clientHeight ?? 0,
  };
  sessionLog('[useCanvas.ts]', 'canvas watcher', JSON.stringify(canvasSize.value));
});

const module = {
  canvas,
  canvasSize,
};

export const useCanvas = () => module;
