import { useMapPartialRenderer, useLayer, useMap } from '~/composables'

const { stage } = useLayer()
const { map } = useMap()
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

export function useMoveToObject() {
  return {
    scrollToObject,
  }
}
