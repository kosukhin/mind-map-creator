import { MINIMAP_SCALE } from '~/constants'
import { Stage } from '~/entities'
import { setElementPosition } from '~/utils'

type Params = [Stage, HTMLElement]

export const miniMapRedrawHandler = ([vStage, vMiniMapScreen]: Params) => {
  const scale = MINIMAP_SCALE

  const calculateMiniScreen = (): [HTMLElement, number, number] => {
    const miniScreenX = vStage.x() * scale * -1
    const miniScreenY = vStage.y() * scale * -1

    console.log('minscreen', vMiniMapScreen)

    setElementPosition(vMiniMapScreen, [miniScreenY, miniScreenX])
    return [vMiniMapScreen, miniScreenX, miniScreenY]
  }

  return {
    calculateMiniScreen,
  }
}
