import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { KonvaEventObject } from 'konva/lib/Node'
import { useSharedLayer } from '~/composables'
import { setValue } from '~/utils'

export const useSharedLayerEvents = createSharedComposable(() => {
  const { layer, stage } = useSharedLayer()
  const dragend = shallowRef<KonvaEventObject<DragEvent>>()
  const dragstart = shallowRef<KonvaEventObject<DragEvent>>()
  const click = shallowRef<KonvaEventObject<MouseEvent>>()
  const stageClick = shallowRef<KonvaEventObject<MouseEvent>>()
  const tap = shallowRef<KonvaEventObject<PointerEvent>>()
  const mouseenter = shallowRef<KonvaEventObject<MouseEvent>>()
  const mouseleave = shallowRef<KonvaEventObject<MouseEvent>>()
  const wheel = shallowRef<KonvaEventObject<WheelEvent>>()
  const dragmove = shallowRef<KonvaEventObject<DragEvent>>()

  watch(layer, () => {
    layer.map((vLayer) => {
      vLayer.on('dragend', setValue(dragend))
      vLayer.on('dragstart', setValue(dragstart))
      vLayer.on('click', setValue(click))
      vLayer.on('tap', setValue(tap))
      vLayer.on('mouseenter', setValue(mouseenter))
      vLayer.on('mouseleave', setValue(mouseleave))
    })
    stage.map((vStage) => {
      vStage.on('wheel', setValue(wheel))
      vStage.on('dragmove', setValue(dragmove))
      vStage.on('click', setValue(stageClick))
      vStage.on('tap', setValue(stageClick))
    })
  })

  return {
    dragend,
    dragstart,
    dragmove,
    click,
    stageClick,
    tap,
    mouseenter,
    mouseleave,
    wheel,
  }
})
