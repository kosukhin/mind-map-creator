import { renderVisibleMapObjects } from '~/application/renderVisibleMapObjects'
import { useLayer, useMap } from '~/composables'

const { layer, stage, layerObjects } = useLayer()
const { map: sharedMap } = useMap()

const triggerPartialRendering = () => {
  if (stage.value && sharedMap.value && layer.value) {
    renderVisibleMapObjects(
      layerObjects,
      stage.value,
      sharedMap.value,
      layer.value
    )
  }
}

export function useMapPartialRenderer() {
  return {
    triggerPartialRendering,
  }
}
