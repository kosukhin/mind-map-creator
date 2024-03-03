import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { useSharedMap } from '~/composables'
import { MapObject } from '~/entities'
import { all, setValue } from '~/utils'

export const useSharedMapObject = createSharedComposable(() => {
  const { map } = useSharedMap()
  const currentObjectId = ref<number>()
  const currentObject = ref<MapObject>()
  watch([currentObjectId, map], () => {
    all([currentObjectId, map] as const).map(([objId, vMap]) => {
      setValue(currentObject, vMap.objects[objId])
    })
  })
  return {
    currentObjectId,
    currentObject,
  }
})
