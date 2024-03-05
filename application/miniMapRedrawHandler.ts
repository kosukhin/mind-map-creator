import debounce from 'lodash/debounce'
import Konva from 'konva'
import { setElementPosition } from '~/utils'
import { Size, Layer, Stage } from '~/entities'
import { MINIMAP_SCALE } from '~/constants'
import { miniMapCalculateSizes } from '~/application'

type Params = [Layer, Stage, HTMLElement, HTMLElement, Size]

export const miniMapRedrawHandler = ([
  vLayer,
  vStage,
  vMiniMap,
  vMiniMapScreen,
  vCanvasSize,
]: Params) => {
  const scale = MINIMAP_SCALE

  const redrawPreviewLayer = debounce(() => {
    const [{ w, h }] = miniMapCalculateSizes([vCanvasSize])
    let previewLayer: Layer | null = null
    const previewStage = new Konva.Stage({
      container: vMiniMap,
      width: w,
      height: h,
      scaleX: scale,
      scaleY: scale,
    })

    previewLayer = vLayer.clone({ listening: false })
    previewStage.add(previewLayer)
  }, 100)

  const calculateMiniScreen = (): [HTMLElement, number, number] => {
    const miniScreenX = vStage.x() * scale * -1
    const miniScreenY = vStage.y() * scale * -1

    console.log('minscreen', vMiniMapScreen)

    setElementPosition(vMiniMapScreen, [miniScreenY, miniScreenX])
    return [vMiniMapScreen, miniScreenX, miniScreenY]
  }

  return {
    redrawPreviewLayer,
    calculateMiniScreen,
  }
}
