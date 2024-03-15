import { watch } from '@vue/runtime-core'
import { layerWheelHandler } from '~/application'
import { useCanvasBoundaries, useLayer, useLayerEvents } from '~/composables'

const { stage } = useLayer()
const { wheel } = useLayerEvents()
const { restrictBoundaries } = useCanvasBoundaries()

watch(wheel, () => {
  if (stage.value && wheel.value) {
    const [vStage, vector] = layerWheelHandler([stage.value, wheel.value])
    vStage.position(restrictBoundaries(vector))
  }
})

export function useLayerListenerWheel() {}
