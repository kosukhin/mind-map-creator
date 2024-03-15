import { watch } from '@vue/runtime-core'
import { useLayer, useLayerEvents } from '~/composables'

const { stage } = useLayer()
const { mouseenter, mouseleave } = useLayerEvents()

watch(mouseenter, () => {
  if (stage.value && mouseenter.value) {
    if (
      mouseenter.value.target.attrs.image ||
      mouseenter.value.target.attrs.text
    ) {
      stage.value.container().style.cursor = 'pointer'
    }
  }
})

watch(mouseleave, () => {
  if (stage.value && mouseleave.value) {
    stage.value.container().style.cursor = 'default'
  }
})

export function useLayerListenerMouse() {}
