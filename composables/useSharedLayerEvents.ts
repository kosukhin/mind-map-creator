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
    if (layer.value) {
      layer.value.on('dragend', setValue(dragend))
      layer.value.on('dragstart', setValue(dragstart))
      layer.value.on('click', setValue(click))
      layer.value.on('tap', setValue(tap))
      layer.value.on('mouseenter', setValue(mouseenter))
      layer.value.on('mouseleave', setValue(mouseleave))
    }
    if (stage.value) {
      stage.value.on('wheel', setValue(wheel))
      stage.value.on('dragmove', setValue(dragmove))
      stage.value.on('click', setValue(stageClick))
      stage.value.on('tap', setValue(stageClick))
    }
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
