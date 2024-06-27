import { mapBuildParentMapNames } from '@/application/mapBuildParentMapNames';
import { requestNormalizeGetMap } from '@/application/requestNormalizeGetMap';
import { MapStructure, MapType } from '@/entities/Map';
import { isNotNullish } from '@/utils/isNotNullish';
import { iterateeHash } from '@/utils/iterateeHash';
import { createMap } from '@/utils/map';
import { compose, property } from 'lodash/fp';
import { allMaps } from '@/domains/data/allMaps';

const isTypesNotNullish = compose(isNotNullish, property('types'));

// FIXME Подумать над именем
export function useRequestGetMap() {
  const getMap = async (
    mapName: string,
  ): Promise<readonly [MapStructure, MapType[]]> => {
    if (!mapName) {
      mapName = 'current';
    }

    console.trace('get map');
    console.log('get map all maps', JSON.stringify(allMaps.value));

    const data: any = allMaps.value[mapName] ?? createMap('', mapName);

    console.log('get map name', mapName);
    console.log('req get map', data);

    const parentNames = mapBuildParentMapNames(mapName);
    let parentTypes: any[] = [];
    if (allMaps.value) {
      const parentsData = parentNames.map((parentMapName) => allMaps.value[parentMapName]);
      const parentNamesDictionary = parentsData
        .reduce(iterateeHash('url', 'settings.title'), {});
      [data].filter(isNotNullish).forEach(() => {
        data.parentNames = parentNamesDictionary;
      });
      parentTypes = parentsData
        .filter(isTypesNotNullish)
        .map((parent) => Object.values(parent.types) as MapType[])
        .flat();
    }

    const response = {
      document: mapName,
      ok: !!data,
      parentTypes,
      data: data && 'structure' in data ? data : ({ structure: data } as any),
    };

    return requestNormalizeGetMap(response, mapName);
  };

  return {
    getMap,
  };
}
