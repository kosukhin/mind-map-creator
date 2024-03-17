import { requestNormalizeGetMap } from '@/application'
import { MapStructure, MapType } from '@/entities'
import { readFileByName } from '@/libraries/browser-fs'

// FIXME убрать в функции
export function useRequestGetMap() {
  const getMap = async (
    mapName: string
  ): Promise<readonly [MapStructure, MapType[]]> => {
    const data = JSON.parse(String(await readFileByName(mapName)))
    const response = {
      document: mapName,
      ok: !!data,
      parentTypes: [],
      data: data && 'structure' in data ? data : ({ structure: data } as any),
    }

    return requestNormalizeGetMap(response, mapName)
  }

  return {
    getMap,
  }
}
