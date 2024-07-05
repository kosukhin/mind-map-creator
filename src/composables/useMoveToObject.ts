import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';
import { useLayer } from '@/composables/useLayer';
import { createSharedComposable } from '@vueuse/core';
import { mapOpened } from '@/domains/data/mapOpened';

export const useMoveToObject = createSharedComposable(() => {
  const { stage } = useLayer();
  const map = mapOpened.value();
  const { triggerPartialRendering } = useMapPartialRenderer();

  const scrollToObject = (id: string) => {
    if (stage.value && map.value) {
      const object = map.value.objects[id];
      if (!object) {
        return;
      }
      const x = object.position[0] * -1 + 20;
      const y = object.position[1] * -1 + 20;
      stage.value.position({ x, y });
      triggerPartialRendering();
    }
  };

  return {
    scrollToObject,
  };
});
