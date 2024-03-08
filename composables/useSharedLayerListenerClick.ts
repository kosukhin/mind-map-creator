import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import debounce from 'lodash/debounce'
import { mapObjectClick } from '~/application'
import {
  useSharedLayerEvents,
  useSharedLocks,
  useSharedMap,
  useSharedMapObject,
  useSharedOverlay,
  useSharedSideBar,
} from '~/composables'
import { openUrlByObject } from '~/utils'

export const useSharedLayerListenerClick = createSharedComposable(() => {
  const { click, tap, stageClick } = useSharedLayerEvents()
  const { map } = useSharedMap()
  const { isSidebarOpen } = useSharedSideBar()
  const { currentObjectId } = useSharedMapObject()
  const { overlayName } = useSharedOverlay()
  const { isClickLocked } = useSharedLocks()

  watch(stageClick, () => {
    isSidebarOpen.value = false
  })

  const onClick = (eventRef: Ref<any>) => {
    if (eventRef.value && map.value) {
      const result = mapObjectClick(isClickLocked.value)([
        eventRef.value,
        map.value,
      ])
      if (result.currentObjectId && map.value) {
        if (map.value.objects[result.currentObjectId]) {
          map.value.objects[result.currentObjectId].lastClick = Date.now()
          map.value.position =
            map.value.objects[result.currentObjectId].position
        }
      }
      if (result.openUrlByObject) {
        openUrlByObject(result.openUrlByObject)
      }
      if (
        result.currentObjectId &&
        !result.openUrlByObject &&
        map.value.objects[result.currentObjectId]
      ) {
        currentObjectId.value = result.currentObjectId ?? undefined
        overlayName.value = result.overlayName ?? undefined
      }
    }
  }

  watch(
    click,
    debounce(() => {
      onClick(click)
    }, 200)
  )

  watch(tap, () => {
    onClick(tap)
  })
})
