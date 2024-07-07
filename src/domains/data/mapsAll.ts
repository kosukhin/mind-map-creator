import { ref } from 'vue';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { applicative } from '@/domains/branching/Applicative';
import { createValueApplicative } from '@/domains/application/createValueApplicative';

export const mapsAll = applicative(ref<Record<string, MapStructure>>({
  current: createMap('', 'current'),
}));
export const mapsAllValue = applicative(
  () => createValueApplicative(mapsAll).value(),
);
