import { MapStructure, MapType } from '@/entities/Map';

export const mapAddType = (type: MapType, map: MapStructure) => {
  map.types[type.name] = type;
  return map;
};
