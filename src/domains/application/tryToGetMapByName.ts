import { mapsAll } from '@/domains/data/mapsAll';

export const tryToGetMapByName = (name: string) => mapsAll.value[name] ?? null;
