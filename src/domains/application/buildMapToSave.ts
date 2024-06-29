import { MapFile, MapStructure } from '@/entities/Map';
import { omit } from 'lodash';

export const buildMapToSave = (
  newMap: MapStructure,
  oldMapContent: MapFile,
  mapName: string,
) => omit(Object.assign(oldMapContent, { [mapName]: newMap }), Object.keys(newMap)) as MapFile;
