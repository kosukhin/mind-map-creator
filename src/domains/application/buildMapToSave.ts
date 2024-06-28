import { MapFile, MapStructure } from '@/entities/Map';
import { omit } from 'lodash';

export const buildMapToSave = (
  mapName: string,
  newMap: MapStructure,
  oldMapContent: MapFile,
) => omit(Object.assign(oldMapContent, { [mapName]: newMap }), Object.keys(newMap));
