import { watch } from '@vue/runtime-core'
import { layerWheelHandler } from '~/application'
import {
  useCanvasBoundaries,
  useSharedLayer,
  useSharedLayerEvents,
} from '~/composables'

export function useLayerListenerWheel() {
  const { stage } = useSharedLayer()
  const { wheel } = useSharedLayerEvents()
  const { restrictBoundaries } = useCanvasBoundaries()

  watch(wheel, () => {
    if (stage.value && wheel.value) {
      const [vStage, vector] = layerWheelHandler([stage.value, wheel.value])
      vStage.position(restrictBoundaries(vector))
    }
  })
}
