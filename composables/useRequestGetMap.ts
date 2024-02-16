import { requestNormalizeGetMap } from '~/application'
import { MapStructure, MapType } from '~/entities'
import { readFileByName } from '~/libraries/browser-fs'

export function useRequestGetMap() {
  const getMap = async (
    mapName: string
  ): Promise<[MapStructure, MapType[]]> => {
    const data = JSON.parse(String(await readFileByName(mapName)))
    const response = {
      document: mapName,
      ok: !!data,
      parentTypes: [],
      data: { structure: data } as any,
    }

    return requestNormalizeGetMap(response, mapName)
  }

  return {
    getMap,
  }
}
