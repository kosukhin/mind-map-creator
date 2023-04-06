import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { ref } from '@vue/reactivity'
import {
  useCurrentMap,
  useLayerEvents,
  useMapObjects,
  useOverlay,
} from '~/composables'
import { all, any } from '~/entities'
import { openUrlByObject, setValue, unwrap } from '~/utils'
import { mapObjectClick } from '~/application'

export const useLayerListenerClick = createSharedComposable(() => {
  const { click, tap } = useLayerEvents()
  const { map } = useCurrentMap()
  const { currentObjectId } = useMapObjects()
  const { overlayName } = useOverlay()
  const isLocked = ref(false)

  watch([tap, click], () => {
    all([any([click, tap] as const), map] as const)
      .map(unwrap(mapObjectClick(isLocked.value)))
      .map((result) => {
        result.currentObjectId.map(setValue(currentObjectId))
        result.overlayName.map(setValue(overlayName))
        result.openUrlByObject.map((object) => openUrlByObject(object))
      })
  })

  return {
    isLocked,
  }
})
