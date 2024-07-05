import { ref } from 'vue';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { applicative } from '@/domains/branching/Applicative';

export const mapsAll = applicative(ref<Record<string, MapStructure>>({
  current: createMap('', 'current'),
}));
