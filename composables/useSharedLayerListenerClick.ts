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
import { all, openUrlByObject, setValue } from '~/utils'

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
        result.currentObjectId = currentObjectId.value ?? null
        result.overlayName = overlayName.value ?? null
        if (result.openUrlByObject) {
          openUrlByObject(result.openUrlByObject)
        }
      }
    }, 200)
  )

  watch(tap, () => {
    all([tap, map] as const)
      .map(mapObjectClick(isClickLocked.value))
      .map((result) => {
        all([result.currentObjectId, map] as const).map(([objectId, vMap]) => {
          if (vMap.objects[objectId]) {
            vMap.objects[objectId].lastClick = Date.now()
            vMap.position = vMap.objects[objectId].position
          }
        })
        result.currentObjectId.map(setValue(currentObjectId))
        result.overlayName.map(setValue(overlayName))
        result.openUrlByObject.map(openUrlByObject)
      })
  })
})
