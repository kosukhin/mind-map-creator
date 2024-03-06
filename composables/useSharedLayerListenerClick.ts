import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { debounce } from 'lodash'
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

  watch(
    click,
    debounce(() => {
      if (click.value && map.value) {
        const result = mapObjectClick(isClickLocked.value)([
          click.value,
          map.value,
        ])
        if (result.currentObjectId && map.value) {
          if (map.value.objects[result.currentObjectId]) {
            map.value.objects[result.currentObjectId].lastClick = Date.now()
            map.value.position =
              map.value.objects[result.currentObjectId].position
          }
        }
        currentObjectId.value = result.currentObjectId ?? undefined
        overlayName.value = result.overlayName ?? undefined
        if (result.openUrlByObject) {
          openUrlByObject(result.openUrlByObject)
        }
      }
    }, 200)
  )

  watch(tap, () => {
    if (tap.value && map.value) {
      const result = mapObjectClick(isClickLocked.value)([tap.value, map.value])

      if (result.currentObjectId) {
        if (map.value.objects[result.currentObjectId]) {
          map.value.objects[result.currentObjectId].lastClick = Date.now()
          map.value.position =
            map.value.objects[result.currentObjectId].position
        }
      }
      currentObjectId.value = result.currentObjectId ?? undefined
      overlayName.value = result.overlayName ?? undefined
      if (result.openUrlByObject) {
        openUrlByObject(result.openUrlByObject)
      }
    }
  })
})
