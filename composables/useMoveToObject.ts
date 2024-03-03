import {
  useMapPartialRenderer,
  useSharedLayer,
  useSharedMap,
} from '~/composables'

export function useMoveToObject() {
  const { stage } = useSharedLayer()
  const { map } = useSharedMap()
  const { triggerPartialRendering } = useMapPartialRenderer()

  const scrollToObject = (id: string) => {
    if (stage.value && map.value) {
      const object = map.value.objects[id]
      if (!object) {
        return
      }
      const x = object.position[0] * -1 + 20
      const y = object.position[1] * -1 + 20
      stage.value.position({ x, y })
      triggerPartialRendering()
    }
  }

  return {
    scrollToObject,
  }
}
