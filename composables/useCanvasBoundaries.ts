import { canvasRestrictBoundaries } from '~/application'
import { useCanvas } from '~/composables'
import { DEFAULT_BOUNDARIES } from '~/constants'
import { Vector2d } from '~/entities'

const { canvasSize } = useCanvas()

const restrictBoundaries = (pos: Vector2d) => {
  if (!canvasSize.value) {
    return DEFAULT_BOUNDARIES
  }

  return canvasRestrictBoundaries(pos)(canvasSize.value)
}

const module = {
  restrictBoundaries,
}

export const useCanvasBoundaries = () => module
