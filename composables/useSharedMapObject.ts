import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { useSharedMap } from '~/composables'
import { MapObject } from '~/entities'
import { setValue } from '~/utils'

export const useSharedMapObject = createSharedComposable(() => {
  const { map } = useSharedMap()
  const currentObjectId = ref<number>()
  const currentObject = ref<MapObject>()
  watch([currentObjectId, map], () => {
    if (currentObjectId.value && map.value) {
      setValue(currentObject, map.value.objects[currentObjectId.value])
    }
  })
  return {
    currentObjectId,
    currentObject,
  }
})
