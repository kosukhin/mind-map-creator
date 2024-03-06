import { computed } from '@vue/reactivity'
import { renderMapObjects } from '~/application'
import {
  useMapPartialRenderer,
  useSharedLayer,
  useSharedLocks,
  useSharedMap,
} from '~/composables'

export function useMapRenderer() {
  const { triggerPartialRendering } = useMapPartialRenderer()
  const { layer, layerObjects } = useSharedLayer()
  const { map } = useSharedMap()
  const { maybeDragLocked } = useSharedLocks()
  const allInit = computed(() => !!layer.value && !!map.value)

  watch([layer, map], () => {
    if (layer.value && map.value && !maybeDragLocked.value) {
      const dispatch = renderMapObjects([
        layer.value,
        map.value,
        !!maybeDragLocked.value,
      ])
      dispatch((vObjects) => {
        vObjects.forEach(([objectId, objects]) => {
          layerObjects.set(objectId, objects)
        })
        setTimeout(() => {
          triggerPartialRendering()
        }, 1000)
      })
    }
  })

  return {
    map,
    allInit,
  }
}
