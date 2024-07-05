import { canvasCreateColorsHash } from '@/application/canvasCreateColorsHash';
import { Dictionary } from '@/entities/Dictionary';
import { computed } from '@vue/reactivity';
import { createSharedComposable } from '@vueuse/core';
import { mapOpened } from '@/domains/data/mapOpened';

export const useMapColors = createSharedComposable(() => {
  const map = mapOpened.value();
  const colorsHash = computed<Dictionary<string>>(
    () => (map.value ? canvasCreateColorsHash(map.value) : {}),
  );

  return {
    colorsHash,
  };
});
