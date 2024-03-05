import { KonvaEventObject } from 'konva/lib/Node'
import { MapStructure } from '~/entities'

type Params = [KonvaEventObject<DragEvent>, MapStructure]

export const layerDragHandler = ([vDrag, vMap]: Params) => {
  const currentObject = vMap.objects[vDrag.target.attrs.objectId]
  return [
    currentObject,
    {
      x: vDrag.target.attrs.x,
      y: vDrag.target.attrs.y,
    },
  ]
}
