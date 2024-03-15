import { watch } from '@vue/runtime-core'
import { useMap } from '~/composables'
import { MapObject } from '~/entities'
import { setValue } from '~/utils'

const { map } = useMap()
const currentObjectId = ref<number>()
const currentObject = ref<MapObject>()

watch([currentObjectId, map], () => {
  if (currentObjectId.value && map.value) {
    setValue(currentObject, map.value.objects[currentObjectId.value])
  }
})

export const useMapObject = () => {
  return {
    currentObjectId,
    currentObject,
  }
}
