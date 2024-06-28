import { ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { MapType } from '@/entities/Map';
import { setValue } from '@/utils/common';
import { mapOpened } from '@/domains/data/mapOpened';

type StrNum = string | number

export const useMapType = createSharedComposable(() => {
  const map = mapOpened;
  const currentTypeId = ref<StrNum>();
  const currentType = ref<MapType>();
  watch(currentTypeId, () => {
    if (map.value && currentTypeId.value) {
      setValue(currentType, map.value.types[currentTypeId.value]);
    }
  });

  return {
    currentTypeId,
    currentType,
  };
});
