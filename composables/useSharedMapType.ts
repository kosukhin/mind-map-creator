import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { useSharedMap } from '~/composables'
import { MapType } from '~/entities'
import { setValue } from '~/utils'

type StrNum = string | number

export const useSharedMapType = createSharedComposable(() => {
  const { map } = useSharedMap()
  const currentTypeId = ref<StrNum>()
  const currentType = ref<MapType>()
  watch(currentTypeId, () => {
    if (map.value && currentTypeId.value) {
      setValue(currentType, map.value.types[currentTypeId.value])
    }
  })

  return {
    currentTypeId,
    currentType,
  }
})
