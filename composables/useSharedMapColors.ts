import { computed } from '@vue/reactivity'
import { createSharedComposable } from '@vueuse/core'
import { useSharedMap } from '~/composables'
import { Dictionary } from '~/entities'
import { canvasCreateColorsHash } from '~/application'

export const useSharedMapColors = createSharedComposable(() => {
  const { map } = useSharedMap()
  const colorsHash = computed<Dictionary<string>>(() =>
    canvasCreateColorsHash(map.value)
  )

  return {
    colorsHash,
  }
})
