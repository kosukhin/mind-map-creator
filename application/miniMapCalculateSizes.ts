import { Size } from '~/entities'
import { CANVAS_HEIGHT, CANVAS_WIDTH, MINIMAP_SCALE } from '~/constants'

type Params = [Size]
type Result = [Size, Size]

export const miniMapCalculateSizes = ([vCanvasSize]: Params): Result => {
  const miniScreenWidth = vCanvasSize.w * MINIMAP_SCALE
  const miniScreenHeight = vCanvasSize.h * MINIMAP_SCALE
  const miniMapWidth = CANVAS_WIDTH * MINIMAP_SCALE
  const miniMapHeight = CANVAS_HEIGHT * MINIMAP_SCALE
  const result: Result = [
    { w: miniMapWidth, h: miniMapHeight },
    { w: miniScreenWidth, h: miniScreenHeight },
  ]
  return result
}
