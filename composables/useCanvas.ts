import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import flow from 'lodash/flow'
import { canvasCreateSize } from '~/application'
import { Size } from '~/entities'
import { apply, map, reMaybe, setValue } from '~/utils'

export const useCanvas = createSharedComposable(() => {
  const canvas = reMaybe<HTMLElement>()
  const canvasSize = reMaybe<Size>()

  watch(canvas, () => {
    apply(canvas, map(flow(canvasCreateSize, setValue(canvasSize))))
  })

  return {
    canvas,
    canvasSize,
  }
})
