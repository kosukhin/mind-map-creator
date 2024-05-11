import { mapBuildParentMapNames } from '@/application/mapBuildParentMapNames';
import { requestNormalizeGetMap } from '@/application/requestNormalizeGetMap';
import { useOpenFile } from '@/composables/useOpenFile';
import { MapStructure, MapType } from '@/entities/Map';
import { readFile } from '@/libraries/browser-fs';
import { isNotNullish } from '@/utils/isNotNullish';
import { iterateeHash } from '@/utils/iterateeHash';
import { jsonParse } from '@/utils/jsonParse';
import { createMap } from '@/utils/map';
import { compose, property } from 'lodash/fp';
import { modelsPoolSet } from '@/modulesHigh/models/modelsPool';

const isTypesNotNullish = compose(isNotNullish, property('types'));
const { forceFile } = useOpenFile();

// FIXME Подумать над именем
export function useRequestGetMap() {
  const getMap = async (
    mapName: string,
  ): Promise<readonly [MapStructure, MapType[]]> => {
    let data: any = null;
    let allMaps: any = null;
    try {
      if (forceFile.value) {
        allMaps = jsonParse(String(await readFile(forceFile.value))) as MapStructure;
        modelsPoolSet('allMaps', allMaps);
      }
      data = allMaps[mapName] ?? createMap('', mapName);
    } catch (e) {
      data = createMap('', mapName);
    }

    const parentNames = mapBuildParentMapNames(mapName);
    let parentTypes: any[] = [];
    if (allMaps) {
      const parentsData = parentNames.map((parentMapName) => allMaps[parentMapName]);
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
