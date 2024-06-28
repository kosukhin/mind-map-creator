import { mapsAll } from '@/domains/data/mapsAll';
import { isNotNullish } from '@/utils/isNotNullish';
import { MapStructure, MapType } from '@/entities/Map';
import { mapBuildParentMapNames } from '@/application/mapBuildParentMapNames';
import { compose, property } from 'lodash/fp';
import { mapUrlToName } from '@/utils/mapUrlToName';

const isTypesNotNullish = compose(isNotNullish, property('types'));

export const buildMapParentTypes = (map: MapStructure) => {
  const mapName = mapUrlToName(map.url);
  const parentNames = mapBuildParentMapNames(mapName);
  const parentsData = parentNames.map((parentMapName) => mapsAll.value[parentMapName]);

  return parentsData
    .filter(isTypesNotNullish)
    .map((parent) => Object.values(parent.types) as MapType[])
    .flat();
};
