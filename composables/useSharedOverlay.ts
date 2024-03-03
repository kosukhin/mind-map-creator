import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { OVERLAY_CLOSE } from '~/constants'
import { setValue } from '~/utils'

export const useSharedOverlay = createSharedComposable(() => {
  const overlayName = ref<string>()
  const tryToClose = ref<string>()
  const history = ref<string[]>([])
  const onOpenCbs = {}
  const isClosed = computed(() => {
    return overlayName.value === OVERLAY_CLOSE
  })
  const open = (newName: string) => {
    overlayName.value = newName
  }
  const onOpen = (openName: string, cb: Function) => {
    if (!onOpenCbs[openName]) {
      onOpenCbs[openName] = []
    }
    onOpenCbs[openName].push(cb)
  }
  const close = () => {
    setValue(overlayName, OVERLAY_CLOSE)
    setValue(tryToClose, OVERLAY_CLOSE)
  }
  const isOpened = (maybeName: string) => {
    return overlayName.value === maybeName
  }
  watch(overlayName, () => {
    overlayName.map((vOverlay) => {
      if (vOverlay !== OVERLAY_CLOSE) {
        if (onOpenCbs[vOverlay]) {
          onOpenCbs[vOverlay].forEach((cb) => cb())
        }
        history.value.push(vOverlay)
      } else {
        setValue(history, [])
      }
    })
  })

  return {
    overlayName,
    tryToClose,
    history,
    isClosed,
    onOpen,
    open,
    close,
    isOpened,
  }
})
