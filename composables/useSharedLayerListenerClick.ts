import { watch } from '@vue/runtime-core'
import debounce from 'lodash/debounce'
import { mapObjectClick } from '~/application'
import {
  useLayerEvents,
  useLocks,
  useMap,
  useMapObject,
  useOverlay,
  useSideBar,
} from '~/composables'
import { openUrlByObject } from '~/utils'

const { click, tap, stageClick } = useLayerEvents()
const { map } = useMap()
const { isSidebarOpen } = useSideBar()
const { currentObjectId } = useMapObject()
const { overlayName } = useOverlay()
const { isClickLocked } = useLocks()

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
        map.value.position = map.value.objects[result.currentObjectId].position
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

export const useSharedLayerListenerClick = () => {}
