import { createSharedComposable } from '@vueuse/core'
import { debounce } from 'lodash'
import { MapLayerObjects, Layer, Stage } from '~/entities'
import { useCanvas } from '~/composables'
import { setValue, shallowReMaybe } from '~/utils'
import { createLayer } from '~/utils/konva'
import { CANVAS_DOM_ID } from '~/constants'

export const useSharedLayer = createSharedComposable(() => {
  const { canvas } = useCanvas()
  const layer = shallowReMaybe<Layer>()
  const stage = shallowReMaybe<Stage>()
  const layerObjects: MapLayerObjects = new Map()

  const doDreateLayer = () => {
    setTimeout(() => {
      const wrapper = findById(CANVAS_DOM_ID)

      if (wrapper) {
        const [newLayer, newStage] = createLayer(wrapper)
        setValue(layer, newLayer)
        setValue(stage, newStage)
      }
    }, 20)
  }

  return {
    layer,
    stage,
    layerObjects,
    createLayer: doDreateLayer,
  }
})
