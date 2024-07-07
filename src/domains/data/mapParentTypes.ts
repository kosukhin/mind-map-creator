import { ref } from 'vue';
import { MapType } from '@/entities/Map';
import { applicative } from '@/domains/branching/Applicative';
import { createValueApplicative } from '@/domains/application/createValueApplicative';

export const mapParentTypes = applicative(ref<MapType[]>([]));
export const mapParentTypesValue = applicative(
  () => createValueApplicative(mapParentTypes).value(),
);
