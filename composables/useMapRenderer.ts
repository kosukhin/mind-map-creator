import { watchOnce } from '@vueuse/core'
import { computed } from '@vue/reactivity'
import {
  useSharedMap,
  useSharedLayer,
  useSharedLocks,
  useMapPartialRenderer,
} from '~/composables'
import { all } from '~/utils'
import { renderMapObjects } from '~/application'

export function useMapRenderer() {
  const { triggerPartialRendering } = useMapPartialRenderer()
  const { layer, stage, layerObjects } = useSharedLayer()
  const { map } = useSharedMap()
  const { maybeDragLocked } = useSharedLocks()
  const allInit = computed(
    () => all([layer, map] as const).map(() => true).value
  )

  watch([layer, map], () => {
    console.log('all init', layer.value, map.value)
  })

  all([stage, map] as const).map(([vStage, vMap]) => {
    if (vMap.position) {
      vStage.position({
        x: -vMap.position[0] + 50,
        y: -vMap.position[1] + 50,
      })
    }
  })
  all([layer, map, maybeDragLocked] as const)
    .map(renderMapObjects)
    .map((dispatch) => {
      dispatch((vObjects) => {
        vObjects.forEach(([objectId, objects]) => {
          layerObjects.set(objectId, objects)
        })
        setTimeout(() => {
          triggerPartialRendering()
        }, 1000)
      })
    })

  return {
    map,
    allInit,
  }
}
