import { CANVAS_HEIGHT, CANVAS_WIDTH } from '~/constants'
import { Size, Vector2d } from '~/entities'

export const canvasRestrictBoundaries =
  (pos: Vector2d) =>
  (canvasSize: Size): Vector2d => {
    const maxRight = CANVAS_WIDTH - canvasSize.w
    const maxBottom = CANVAS_HEIGHT - canvasSize.h
    const right = pos.x * -1
    const bottom = pos.y * -1
    if (maxBottom < 0 || maxRight < 0) {
      return { x: 0, y: 0 }
    }
    return {
      x: pos.x > 0 ? 0 : right > maxRight ? maxRight * -1 : pos.x,
      y: pos.y > 0 ? 0 : bottom > maxBottom ? maxBottom * -1 : pos.y,
    }
  }
