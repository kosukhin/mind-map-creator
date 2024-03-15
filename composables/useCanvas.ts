import { watch } from '@vue/runtime-core'
import { Size } from '~/entities'

const canvas = ref<HTMLElement>()
const canvasSize = ref<Size>()

watch(canvas, () => {
  canvasSize.value = {
    w: canvas.value?.clientWidth ?? 0,
    h: canvas.value?.clientHeight ?? 0,
  }
})

const module = {
  canvas,
  canvasSize,
}

export const useCanvas = () => module
