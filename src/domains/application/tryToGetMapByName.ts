import { MapFile } from '@/entities/Map';

export const tryToGetMapByName = (mapsAll: MapFile, name: string) => mapsAll[name] ?? null;
