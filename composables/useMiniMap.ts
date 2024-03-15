import { watch } from '@vue/runtime-core'
import { watchOnce } from '@vueuse/core'
import debounce from 'lodash/debounce'
import { Nullable } from './../entities/Nullable'
import { miniMapCalculateSizes, miniMapRedrawHandler } from '~/application'
import { useCanvas, useLayer, useLayerEvents, useMap } from '~/composables'
import { MINI_MAP_UPDATE_FREQ } from '~/constants'

const { firstMapLoad } = useMap()
const { layer, stage } = useLayer()
const { canvasSize } = useCanvas()
const { dragmove, wheel } = useLayerEvents()

export const useMiniMap = (
  miniMap: Nullable<HTMLDivElement>,
  miniMapScreen: Nullable<HTMLDivElement>
) => {
  watchOnce(firstMapLoad, () => {
    setTimeout(() => {
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
            stage.value,
            miniMapScreen,
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
