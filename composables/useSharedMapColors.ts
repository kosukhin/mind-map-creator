import { computed } from '@vue/reactivity'
import { canvasCreateColorsHash } from '~/application'
import { useMap } from '~/composables'
import { Dictionary } from '~/entities'

const { map } = useMap()
const colorsHash = computed<Dictionary<string>>(() =>
  map.value ? canvasCreateColorsHash(map.value) : {}
)

export const useMapColors = () => {
  return {
    colorsHash,
  }
}
