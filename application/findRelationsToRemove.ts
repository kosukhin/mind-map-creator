import { MapObject, MapStructure } from '~/entities'

type RelativeObject = { objectId: string; indexes: string[] }

export const findRelationsToRemove = (
  vObject: MapObject,
  vMap: MapStructure
): any => {
  let relations: any[] | null = null
  Object.values(vMap.objects).forEach((currentObject) => {
    const result: RelativeObject = { objectId: currentObject.id, indexes: [] }
    if (currentObject.arrows?.length) {
      for (const relationIndex in currentObject.arrows) {
        if (currentObject.arrows[relationIndex].id === vObject.id) {
          result.indexes.push(relationIndex)
          break
        }
      }
    }
    if (result.indexes.length) {
      if (!relations) {
        relations = []
      }
      relations.push(result)
    }
  })
  return relations
}
