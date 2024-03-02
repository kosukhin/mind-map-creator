import { createSharedComposable } from '@vueuse/core'
import { useCanvas, useLayerListeners, useSharedMap } from '~/composables'
import { CANVAS_DOM_ID } from '~/constants'
import { Layer, MapLayerObjects, Stage } from '~/entities'
import { setValue, shallowReMaybe } from '~/utils'

import { createLayer } from '~/utils/konva'

export const useSharedLayer = createSharedComposable(() => {
  const { canvas } = useCanvas()
  const layer = shallowReMaybe<Layer>()
  const stage = shallowReMaybe<Stage>()
  const layerObjects: MapLayerObjects = new Map()
  const { firstMapLoad } = useSharedMap()

  const doDreateLayer = () => {
    setTimeout(() => {
      firstMapLoad.value = false
      const wrapper = findById(CANVAS_DOM_ID)
      canvas.value = wrapper
      useLayerListeners()

      if (wrapper) {
        const [newLayer, newStage] = createLayer(wrapper)
        setValue(layer, newLayer)
        setValue(stage, newStage)
      }

      setTimeout(() => {
        firstMapLoad.value = true
      }, 100)
    }, 20)
  }

  return {
    layer,
    stage,
    layerObjects,
    createLayer: doDreateLayer,
  }
})
