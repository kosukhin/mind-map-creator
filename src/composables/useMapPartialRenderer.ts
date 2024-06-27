import {createSharedComposable} from '@vueuse/core';
import {renderVisibleMapObjects} from '@/application/renderVisibleMapObjects';
import {useLayer} from '@/composables/useLayer';
import {ref} from '@vue/reactivity';
import {mapOpened} from "@/domains/data/mapOpened";

export const useMapPartialRenderer = createSharedComposable(() => {
  const { layer, stage, layerObjects } = useLayer();
  const sharedMap = mapOpened;
  const partialRenderCounter = ref(0);

  const triggerPartialRendering = () => {
    if (stage.value && sharedMap.value && layer.value) {
      partialRenderCounter.value += 1;
      renderVisibleMapObjects(
        layerObjects,
        stage.value,
        sharedMap.value,
        layer.value,
      );
    }
  };

  return {
    triggerPartialRendering,
    partialRenderCounter,
  };
});
