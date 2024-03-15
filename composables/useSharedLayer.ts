import { useCanvas, useLayerListeners, useMap } from '~/composables'
import { CANVAS_DOM_ID } from '~/constants'
import { Layer, MapLayerObjects, Stage } from '~/entities'
import { setValue } from '~/utils'

import { createLayer } from '~/utils/konva'

const { canvas } = useCanvas()
const layer = shallowRef<Layer>()
const stage = shallowRef<Stage>()
const layerObjects: MapLayerObjects = new Map()
const { firstMapLoad } = useMap()

const doCreateLayer = () => {
  setTimeout(() => {
    firstMapLoad.value = false
    const wrapper = findById(CANVAS_DOM_ID)
    canvas.value = wrapper ?? undefined
    useLayerListeners()

    if (wrapper) {
      const [newLayer, newStage] = createLayer(wrapper)
      setValue(layer, newLayer)
      setValue(stage, newStage)
    }

    setTimeout(() => {
      firstMapLoad.value = true
    }, 100)
  }, 0)
}

export const useLayer = () => {
  return {
    layer,
    stage,
    layerObjects,
    createLayer: doCreateLayer,
  }
}
