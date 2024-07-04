import { ref, watch } from "vue";
import { useSessionLog } from "@/composables/useSessionLog";
import { canvasSize } from "@/domains/data/canvasSize";

const canvas = ref<HTMLElement>();
const { sessionLog } = useSessionLog();

watch(canvas, () => {
  canvasSize.value = {
    w: canvas.value?.clientWidth ?? 0,
    h: canvas.value?.clientHeight ?? 0,
  };
  sessionLog("[useCanvas.ts]", "canvas watcher", JSON.stringify(canvasSize.value));
});

const module = {
  canvas,
  canvasSize,
};

export const useCanvas = () => module;
