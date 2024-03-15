import { computed } from '@vue/reactivity'
import debounce from 'lodash/debounce'
import { canvasRestrictBoundaries, renderMapObjects } from '~/application'
import {
  useMapPartialRenderer,
  useLayer,
  useLocks,
  useMap,
} from '~/composables'

const { triggerPartialRendering } = useMapPartialRenderer()
const { layer, stage, layerObjects } = useLayer()
const { map } = useMap()
const { maybeDragLocked } = useLocks()
const allInit = computed(() => !!layer.value && !!map.value)
const { canvasSize } = useCanvas()

watch(
  [layer, map],
  debounce(() => {
    if (stage.value && map.value?.position && canvasSize.value) {
      const [x, y] = map.value.position
      const halfWidth = canvasSize.value.w / 2
      const halfHeight = canvasSize.value.h / 2
      const savedPos = { x: -x + halfWidth, y: -y + halfHeight }
      const pos = canvasRestrictBoundaries(savedPos, canvasSize.value)
      stage.value.position(pos)
    }

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
  }, 100)
)

export function useMapRenderer() {
  return {
    map,
    allInit,
  }
}
