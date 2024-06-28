import { ref } from 'vue';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';

export const mapsAll = ref<Record<string, MapStructure>>({
  current: createMap('', 'current'),
});
