import { watch } from '@vue/runtime-core'
import { watchOnce } from '@vueuse/core'
import debounce from 'lodash/debounce'
import { Nullable } from './../entities/Nullable'
import { miniMapCalculateSizes, miniMapRedrawHandler } from '~/application'
import {
  useCanvas,
  useSharedLayer,
  useSharedLayerEvents,
  useSharedMap,
} from '~/composables'
import { MINI_MAP_UPDATE_FREQ } from '~/constants'

export const useMiniMap = (
  miniMap: Nullable<HTMLDivElement>,
  miniMapScreen: Nullable<HTMLDivElement>
) => {
  const { firstMapLoad } = useSharedMap()
  const { layer, stage } = useSharedLayer()
  const { canvasSize } = useCanvas()
  const { dragmove, wheel } = useSharedLayerEvents()

  watchOnce(firstMapLoad, () => {
    if (
      layer.value &&
      stage.value &&
      miniMap &&
      miniMapScreen &&
      canvasSize.value
    ) {
      const { redrawPreviewLayer } = miniMapRedrawHandler([
        layer.value,
        stage.value,
        miniMap,
        miniMapScreen,
        canvasSize.value,
      ])
      setTimeout(redrawPreviewLayer)
    }

    if (canvasSize.value) {
      const [miniMapSizes, miniMapScreenSizes] = miniMapCalculateSizes([
        canvasSize.value,
      ])

      if (miniMap && miniMapScreen) {
        miniMap.style.width = miniMapSizes.w + 'px'
        miniMap.style.height = miniMapSizes.h + 'px'
        miniMapScreen.style.width = miniMapScreenSizes.w + 'px'
        miniMapScreen.style.height = miniMapScreenSizes.h + 'px'
      }
    }
  })

  watch(
    [dragmove, wheel],
    debounce(() => {
      if (dragmove.value || wheel.value) {
        if (
          layer.value &&
          stage.value &&
          miniMap &&
          miniMapScreen &&
          canvasSize.value
        ) {
          const { calculateMiniScreen } = miniMapRedrawHandler([
            layer.value,
            stage.value,
            miniMap,
            miniMapScreen,
            canvasSize.value,
          ])
          const [vMiniMapScreen, miniScreenX, miniScreenY] =
            calculateMiniScreen()
          vMiniMapScreen.style.top = miniScreenY + 'px'
          vMiniMapScreen.style.left = miniScreenX + 'px'
        }
      }
    }, MINI_MAP_UPDATE_FREQ)
  )
}
