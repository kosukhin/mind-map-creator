import { mapBuildParentMapNames } from '@/application/mapBuildParentMapNames';
import { requestNormalizeGetMap } from '@/application/requestNormalizeGetMap';
import { MapStructure, MapType } from '@/entities/Map';
import { isNotNullish } from '@/utils/isNotNullish';
import { iterateeHash } from '@/utils/iterateeHash';
import { createMap } from '@/utils/map';
import { compose, property } from 'lodash/fp';
import { allMaps } from '@/domains/data/allMaps';

const isTypesNotNullish = compose(isNotNullish, property('types'));

export function useRequestGetMap() {
  /*
  Здесь логика получает объект текущей карты и получает родительские типы
  - По урлу найти текущую карту в allMaps
  - По текущей карте найти ее родительские типы
   */
  const getMap = async (
    mapName: string,
  ): Promise<readonly [MapStructure, MapType[]]> => {
    if (!mapName) {
      mapName = 'current';
    }
    const data: any = allMaps.value[mapName] ?? createMap('', mapName);
    const parentNames = mapBuildParentMapNames(mapName);
    let parentTypes: any[] = [];

    // Строятся родительские типы
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
    // Строятся родительские типы

    // Строится не нужный никому формат ответа
    const response = {
      document: mapName,
      ok: !!data,
      parentTypes,
      data: data && 'structure' in data ? data : ({ structure: data } as any),
    };
    // Строится не нужный никому формат ответа

    // Не нужный формат ответа переводится в 2 значение массив род типов и текущая карта
    return requestNormalizeGetMap(response, mapName);
    // Не нужный формат ответа переводится в 2 значение массив род типов и текущая карта
  };

  return {
    getMap,
  };
}
