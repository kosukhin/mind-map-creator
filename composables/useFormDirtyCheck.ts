import { watch } from '@vue/runtime-core'
import { Ref } from '@vue/reactivity'
import { useSharedOverlay } from '~/composables'
import { OVERLAY_CLOSE, OVERLAY_CLOSE_ALERT } from '~/constants'
import { formDirtyCheck } from '~/application'
import { setValue } from '~/utils'

export function useFormDirtyCheck(isDirty: Ref<boolean>, formName: string) {
  const { tryToClose, close } = useSharedOverlay()
  watch(tryToClose, () => {
    if (tryToClose.value) {
      const needConfirm = formDirtyCheck(
        isDirty.value,
        formName,
        tryToClose.value
      )

      if (needConfirm) {
        setValue(tryToClose, OVERLAY_CLOSE)
        if (!needConfirm || confirm(OVERLAY_CLOSE_ALERT)) {
          close()
        }
      }
    }
  })
}
