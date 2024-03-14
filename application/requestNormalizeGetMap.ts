import { MapResponse, MapStructure, MapType } from '~/entities'
import { createMap } from '~/utils'
import { MAP_DEFAULT_TITLE } from '~/constants'

export const requestNormalizeGetMap = (
  response: MapResponse,
  mapName: string
) => {
  let result
  if (!response.ok) {
    result = createMap(mapName)
  } else {
    result = response.data.structure
  }
  result.document = response.data.document
  result.settings = Object.assign(
    {
      colored: false,
      title: MAP_DEFAULT_TITLE,
    },
    result.settings ?? {}
  )
  for (const typeId of Object.keys(result.types)) {
    result.types[typeId] = {
      ...result.types[typeId],
      name: result.types[typeId].name ? result.types[typeId].name : typeId,
    }
  }
  for (const objectId of Object.keys(result.objects)) {
    result.objects[objectId] = {
      ...result.objects[objectId],
      id: objectId,
    }
  }
  return [result as MapStructure, response.parentTypes as MapType[]] as const
}
