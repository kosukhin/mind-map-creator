import { createSharedComposable } from '@vueuse/core'
import { shallowReactive } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { Maybe, MapLayerObjects, Layer, Stage } from '~/entities'
import { useCanvas } from '~/composables'
import { createLayer, setValue } from '~/utils'

export const useLayer = createSharedComposable(() => {
  const { canvas } = useCanvas()
  const layer = shallowReactive(Maybe<Layer>())
  const stage = shallowReactive(Maybe<Stage>())
  const layerObjects: MapLayerObjects = new Map()

  watch(canvas, () => {
    canvas.map((vCanvas) => {
      const [newLayer, newStage] = createLayer(vCanvas)
      setValue(layer, newLayer)
      setValue(stage, newStage)
    })
  })

  return {
    layer,
    stage,
    layerObjects,
  }
})
