import { watch } from '@vue/runtime-core'
import { useMap } from '~/composables'
import { MapType } from '~/entities'
import { setValue } from '~/utils'

type StrNum = string | number

const { map } = useMap()
const currentTypeId = ref<StrNum>()
const currentType = ref<MapType>()

watch(currentTypeId, () => {
  if (map.value && currentTypeId.value) {
    setValue(currentType, map.value.types[currentTypeId.value])
  }
})

export const useMapType = () => {
  return {
    currentTypeId,
    currentType,
  }
}
