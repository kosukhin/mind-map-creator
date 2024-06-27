import { computed } from 'vue';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { mapOpened } from '@/domains/data/mapOpened';

export const useMapFeatures = () => {
  const mapName = computed(() => mapUrlToName(mapOpened.value?.url ?? '/current'));

  return {
    mapName,
  };
};
