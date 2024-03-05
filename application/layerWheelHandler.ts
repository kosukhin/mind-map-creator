import { KonvaEventObject } from 'konva/lib/Node'
import { Stage } from '~/entities'

type Params = [Stage, KonvaEventObject<WheelEvent>]

export const layerWheelHandler = ([vStage, e]: Params) => {
  e.evt.preventDefault()
  const dx = e.evt.deltaX
  const dy = e.evt.deltaY
  const x = vStage.x() - dx
  const y = vStage.y() - dy
  return [vStage, { x, y }]
}
