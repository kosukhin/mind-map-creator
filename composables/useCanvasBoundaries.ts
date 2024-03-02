import { canvasRestrictBoundaries } from '~/application'
import { useCanvas } from '~/composables'
import { DEFAULT_BOUNDARIES } from '~/constants'
import { Vector2d } from '~/entities'

export function useCanvasBoundaries() {
  const { canvasSize } = useCanvas()
  const restrictBoundaries = (pos: Vector2d) => {
    if (!canvasSize.value) {
      return DEFAULT_BOUNDARIES
    }

    return canvasRestrictBoundaries(pos)(canvasSize.value)
  }

  return {
    restrictBoundaries,
  }
}
