import { watch } from '@vue/runtime-core'
import { createSharedComposable, watchOnce } from '@vueuse/core'
import debounce from 'lodash/debounce'
import {
  useCanvas,
  useSharedMap,
  useSharedLayer,
  useSharedLayerEvents,
} from '~/composables'
import { MaybeInst } from '~/entities'
import { all, any } from '~/utils'
import { miniMapCalculateSizes, miniMapRedrawHandler } from '~/application'
import { MINI_MAP_UPDATE_FREQ } from '~/constants'

export const useMiniMap = createSharedComposable(
  (
    miniMap: MaybeInst<HTMLDivElement>,
    miniMapScreen: MaybeInst<HTMLDivElement>
  ) => {
    const { firstMapLoad } = useSharedMap()
    const { layer, stage } = useSharedLayer()
    const { canvasSize } = useCanvas()
    const { dragmove, wheel } = useSharedLayerEvents()
    watchOnce(
      () => canvasSize,
      debounce(() => {
        all([canvasSize] as const)
          .map(miniMapCalculateSizes)
          .map(([miniMapSizes, miniMapScreenSizes]) => {
            all([miniMap, miniMapScreen] as const).map(
              ([vMiniMap, vMiniMapScreen]) => {
                vMiniMap.style.width = miniMapSizes.w + 'px'
                vMiniMap.style.height = miniMapSizes.h + 'px'
                vMiniMapScreen.style.width = miniMapScreenSizes.w + 'px'
                vMiniMapScreen.style.height = miniMapScreenSizes.h + 'px'
              }
            )
          })
      }, 100)
    )

    watch(firstMapLoad, () => {
      all([layer, stage, miniMap, miniMapScreen, canvasSize] as const)
        .map(miniMapRedrawHandler)
        .map(({ redrawPreviewLayer }) => {
          setTimeout(redrawPreviewLayer)
        })
    })

    watch(
      [dragmove, wheel],
      debounce(() => {
        any([dragmove, wheel] as const).map(() => {
          all([layer, stage, miniMap, miniMapScreen, canvasSize] as const)
            .map(miniMapRedrawHandler)
            .map(({ redrawPreviewLayer, calculateMiniScreen }) => {
              setTimeout(redrawPreviewLayer)
              const [vMiniMapScreen, miniScreenX, miniScreenY] =
                calculateMiniScreen()
              vMiniMapScreen.style.top = miniScreenY + 'px'
              vMiniMapScreen.style.left = miniScreenX + 'px'
            })
        })
      }, MINI_MAP_UPDATE_FREQ)
    )
  }
)
