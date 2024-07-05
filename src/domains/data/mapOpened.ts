import { ref } from 'vue';
import { MapStructure } from '@/entities/Map';
import { applicative } from '@/domains/branching/Applicative';

export const mapOpened = applicative(ref<MapStructure>());
