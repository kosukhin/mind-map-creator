import { watch } from '@vue/runtime-core'
import { useSharedOverlay } from '~/composables'

export function useOverlayAutoClose(formName: string) {
  const { tryToClose, close } = useSharedOverlay()
  watch(tryToClose, () => {
    if (tryToClose.value && tryToClose.value === formName) {
      close()
    }
  })
}
