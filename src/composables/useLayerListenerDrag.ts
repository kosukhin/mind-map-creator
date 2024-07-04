import { layerDragHandler } from '@/application/layerDragHandler';
import { layerDragObjectHandler } from '@/application/layerDragObjectHandler';
import { useCanvas } from '@/composables/useCanvas';
import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';
import { useLayer } from '@/composables/useLayer';
import { useLayerEvents } from '@/composables/useLayerEvents';
import { useLocks } from '@/composables/useLocks';
import { setProperty } from '@/utils/common';
import { applyArrowPoints } from '@/utils/map';
import { watch } from '@vue/runtime-core';
import { createSharedComposable } from '@vueuse/core';
import Konva from 'konva';
import { debounce, throttle } from 'lodash';
import { mapOpened } from '@/domains/data/mapOpened';
import { useCanvasBoundaries } from '@/domains/composables/useCanvasBoundaries';

// FIXME выделить вотчеры вынуть их из функции
export const useLayerListenerDrag = createSharedComposable(() => {
  const { canvasSize } = useCanvas();
  const { isDragLocked } = useLocks();
  const { dragend, dragmove, wheel } = useLayerEvents();
  const { triggerPartialRendering } = useMapPartialRenderer();
  let dragMoveInterval: any = null;

  const map = mapOpened;
  const { restrictBoundaries } = useCanvasBoundaries();
  const { stage, layer, layerObjects } = useLayer();

  setTimeout(() => {
    if (stage.value) {
      stage.value.dragBoundFunc(restrictBoundaries);
    }
  }, 100);

  watch(dragend, () => {
    if (isDragLocked.value) return;
    if (dragend.value && map.value) {
      const [object, position] = layerDragHandler([dragend.value, map.value]);
      setProperty(object, 'position', [position.x, position.y]);
    }
    if (dragMoveInterval) {
      clearInterval(dragMoveInterval);
    }
  });

  watch(dragmove, () => {
    if (isDragLocked.value) return;

    if (dragmove.value && map.value) {
      const { arrows, relatedArrows } = layerDragObjectHandler(layerObjects)([
        dragmove.value,
        map.value,
      ]);

      if (arrows) {
        applyArrowPoints(arrows);
      }
      if (relatedArrows) {
        applyArrowPoints(relatedArrows);
      }
    }

    if (stage.value && dragmove.value && canvasSize.value) {
      if (dragmove.value.evt instanceof PointerEvent || dragmove.value.evt instanceof TouchEvent) {
        return;
      }
      // Логика автопрокрутки
      if (
        dragmove.value.target instanceof Konva.Rect
        || dragmove.value.target instanceof Konva.Group
      ) {
        const { offsetX: ofx, offsetY: ofy } = dragmove.value.evt;
        const mustMove = ofx < 50 || ofx > canvasSize.value.w - 50 || ofy < 50 || ofy > canvasSize.value.h - 50;

        if (!mustMove) {
          if (dragMoveInterval) {
            clearInterval(dragMoveInterval);
          }
          return;
        }

        const offsetX = (Math.round(canvasSize.value.w / 2) - dragmove.value.evt.offsetX) / 10;
        const offsetY = (Math.round(canvasSize.value.h / 2) - dragmove.value.evt.offsetY) / 10;

        if (dragMoveInterval) {
          clearInterval(dragMoveInterval);
        }

        dragMoveInterval = setInterval(() => {
          if (layer.value) {
            layer.value.position(
              restrictBoundaries({
                x: layer.value.x() + offsetX,
                y: layer.value.y() + offsetY,
              }),
            );
          }
        }, 30);
      }
    }
  });

  const partialRenderingDelay = 500;
  watch(
    dragmove,
    throttle((e) => {
      if (e.target && e.target instanceof Konva.Stage) {
        triggerPartialRendering();
      }
    }, partialRenderingDelay),
  );

  watch(
    wheel,
    debounce(() => {
      triggerPartialRendering();
    }, partialRenderingDelay),
  );
});
