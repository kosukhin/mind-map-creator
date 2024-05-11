import { computed } from 'vue';
import { modelsPoolGet } from '@/modulesHigh/models/modelsPool';
import { MapStructure } from '@/entities/Map';

export const useMap = () => {
  const map = computed(() => modelsPoolGet<MapStructure>('map'));

  return {
    map,
  };
};
