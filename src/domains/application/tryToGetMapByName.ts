import { allMaps } from '@/domains/data/allMaps';

export const tryToGetMapByName = (name: string) => allMaps.value[name] ?? null;
