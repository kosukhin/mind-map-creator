import { watch } from '@vue/runtime-core'
import { useOverlay } from '~/composables'

export function useOverlayAutoClose(formName: string) {
  const { tryToClose, close } = useOverlay()
  watch(tryToClose, () => {
    if (tryToClose.value && tryToClose.value === formName) {
      close()
    }
  })
}
