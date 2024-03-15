import set from 'lodash/set'
import { canvasRestrictBoundaries } from '~/application'
import { ensureThen, fnify, later } from '~/combinators/ensureThen'
import { useCanvas } from '~/composables'
import { DEFAULT_BOUNDARIES } from '~/constants'
import { Vector2d } from '~/entities'

const { canvasSize } = useCanvas()

const restrictBoundaries = (pos: Vector2d) => {
  const result = { value: DEFAULT_BOUNDARIES }
  ensureThen(fnify(!!canvasSize.value))(
    later(
      set,
      result,
      'value',
      later(canvasRestrictBoundaries, pos, canvasSize.value)
    )
  )

  return result.value
}

const module = {
  restrictBoundaries,
}

export const useCanvasBoundaries = () => module
