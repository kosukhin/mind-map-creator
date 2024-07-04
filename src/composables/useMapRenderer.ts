import { canvasRestrictBoundaries } from '@/application/canvasRestrictBoundaries';
import { renderMapObjects } from '@/application/renderMapObjects';
import { useCanvas } from '@/composables/useCanvas';
import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';
import { useLayer } from '@/composables/useLayer';
import { useLocks } from '@/composables/useLocks';
import { computed } from '@vue/reactivity';
import { createSharedComposable } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { watch } from 'vue';
import { mapOpened } from '@/domains/data/mapOpened';
import { canvasSize } from '@/domains/data/canvasSize';

export const useMapRenderer = createSharedComposable(() => {
  const { triggerPartialRendering } = useMapPartialRenderer();
  const { layer, stage, layerObjects } = useLayer();
  const map = mapOpened;
  const { maybeDragLocked } = useLocks();
  const allInit = computed(() => !!layer.value && !!map.value);

  watch(
    [layer, map],
    debounce(() => {
      if (stage.value && map.value?.position && canvasSize.value) {
        const [x, y] = map.value.position;
        const halfWidth = canvasSize.value.w / 2;
        const halfHeight = canvasSize.value.h / 2;
        const savedPos = { x: -x + halfWidth, y: -y + halfHeight };
        const pos = canvasRestrictBoundaries(savedPos)(canvasSize.value);
        stage.value.position(pos);
      }

      if (layer.value && map.value && !maybeDragLocked.value) {
        const dispatch = renderMapObjects([
          layer.value,
          map.value,
          !!maybeDragLocked.value,
        ]);
        dispatch((vObjects) => {
          vObjects.forEach(([objectId, objects]) => {
            layerObjects.set(objectId, objects);
          });
          triggerPartialRendering();
        });
      }
    }, 100),
  );

  return {
    map,
    allInit,
  };
});
