import { ref } from 'vue';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';

export const allMaps = ref<Record<string, MapStructure>>({
  current: createMap('', 'current'),
});
