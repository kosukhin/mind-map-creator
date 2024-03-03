import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { Size } from '~/entities'

export const useCanvas = createSharedComposable(() => {
  const canvas = ref<HTMLElement>()
  const canvasSize = ref<Size>()

  watch(canvas, () => {
    canvasSize.value = {
      w: canvas.value?.clientWidth ?? 0,
      h: canvas.value?.clientHeight ?? 0,
    }
  })

  return {
    canvas,
    canvasSize,
  }
})
