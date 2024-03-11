import { watch } from '@vue/runtime-core'
import Konva from 'konva'
import debounce from 'lodash/debounce'
import { layerDragHandler, layerDragObjectHandler } from '~/application'
import {
  useCanvas,
  useCanvasBoundaries,
  useMapPartialRenderer,
  useSharedLayer,
  useSharedLayerEvents,
  useSharedLocks,
  useSharedMap,
} from '~/composables'
import { applyArrowPoints, debug, setProperty } from '~/utils'

export function useLayerListenerDrag() {
  const { canvasSize } = useCanvas()
  const { stage, layer, layerObjects } = useSharedLayer()
  const { firstMapLoad, map } = useSharedMap()
  const { isDragLocked } = useSharedLocks()
  const { dragend, dragmove, wheel } = useSharedLayerEvents()
  const { restrictBoundaries } = useCanvasBoundaries()
  const { triggerPartialRendering } = useMapPartialRenderer()
  let dragMoveInterval: any = null

  watch(dragend, () => {
    debug('debug fired', 'drag')
    if (isDragLocked.value) return
    if (dragend.value && map.value) {
      const [object, position] = layerDragHandler([dragend.value, map.value])
      setProperty(object, 'position', [position.x, position.y])
    }
    dragMoveInterval && clearInterval(dragMoveInterval)
  })

  watch(dragmove, () => {
    if (isDragLocked.value) return

    if (dragmove.value && map.value) {
      const { text, arrows, relatedArrows, additionalText } =
        layerDragObjectHandler(layerObjects)([dragmove.value, map.value])

      if (text) {
        const [vText, position] = text
        vText.position(position)
      }
      if (arrows) {
        applyArrowPoints(arrows)
      }
      if (relatedArrows) {
        applyArrowPoints(relatedArrows)
      }
      if (additionalText) {
        const [vText, position] = additionalText
        vText.position(position)
      }
    }

    if (stage.value && dragmove.value && canvasSize.value) {
      if (
        dragmove.value.evt instanceof PointerEvent ||
        dragmove.value.evt instanceof TouchEvent
      ) {
        return
      }
      if (
        dragmove.value.target instanceof Konva.Image ||
        dragmove.value.target instanceof Konva.Group
      ) {
        const { offsetX: ofx, offsetY: ofy } = dragmove.value.evt
        const mustMove =
          ofx < 50 ||
          ofx > canvasSize.value.w - 50 ||
          ofy < 50 ||
          ofy > canvasSize.value.h - 50

        if (!mustMove) {
          dragMoveInterval && clearInterval(dragMoveInterval)
          return
        }

        const offsetX =
          (Math.round(canvasSize.value.w / 2) - dragmove.value.evt.offsetX) / 10
        const offsetY =
          (Math.round(canvasSize.value.h / 2) - dragmove.value.evt.offsetY) / 10
        dragMoveInterval && clearInterval(dragMoveInterval)
        dragMoveInterval = setInterval(() => {
          if (layer.value) {
            layer.value.position(
              restrictBoundaries({
                x: layer.value.x() + offsetX,
                y: layer.value.y() + offsetY,
              })
            )
          }
        }, 30)
      }
    }
  })

  const partialRenderingDelay = 250
  watch(
    dragmove,
    debounce((e) => {
      if (e.target && e.target instanceof Konva.Stage) {
        triggerPartialRendering()
      }
    }, partialRenderingDelay)
  )

  watch(
    wheel,
    debounce(() => {
      triggerPartialRendering()
    }, partialRenderingDelay)
  )

  watch(firstMapLoad, () => {
    if (stage.value) {
      stage.value.dragBoundFunc(restrictBoundaries)
    }
  })
}
