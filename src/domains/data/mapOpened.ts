import { createValueApplicative } from '@/domains/application/createValueApplicative';
import { applicative } from '@/domains/branching/Applicative';
import { MapStructure } from '@/entities/Map';
import { ref } from 'vue';

export const mapOpened = applicative(ref<MapStructure>());
export const mapOpenedValue = applicative(
  () => createValueApplicative(mapOpened).value(),
);
