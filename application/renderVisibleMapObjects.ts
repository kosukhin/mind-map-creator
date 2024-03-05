import { calculateVisibleObjects } from '~/application/layerDragObjectHandler'
import { addObjectToLayer, removeObjectOnLayer } from '~/utils/konva'
import { KonvaLayerObject } from '~/entities'

export const renderVisibleMapObjects = (
  layerObjects: any,
  vStage: any,
  vMap: any,
  vLayer: any
) => {
  vLayer.destroyChildren()
  layerObjects.clear()
  const [visible, invisible] = calculateVisibleObjects(vMap, vStage)
  visible.forEach(async (object) => {
    removeObjectOnLayer(layerObjects, object)
    const objects = await addObjectToLayer(vLayer, object, vMap, false)
    layerObjects.set(object.id, objects as KonvaLayerObject[])
  })
  invisible.forEach((object) => {
    removeObjectOnLayer(layerObjects, object)
  })
}
