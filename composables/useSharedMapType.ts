import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { useSharedMap } from '~/composables'
import { MapType } from '~/entities'
import { all, setValue } from '~/utils'

type StrNum = string | number

export const useSharedMapType = createSharedComposable(() => {
  const { map } = useSharedMap()
  const currentTypeId = ref<StrNum>()
  const currentType = ref<MapType>()
  watch(currentTypeId, () => {
    all([map, currentTypeId] as const).map(([vMap, vType]) => {
      setValue(currentType, vMap.types[vType])
    })
  })

  return {
    currentTypeId,
    currentType,
  }
})
