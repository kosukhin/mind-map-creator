import { watch } from '@vue/runtime-core'
import { Ref } from '@vue/reactivity'
import { createSharedComposable } from '@vueuse/core'
import { useSharedOverlay } from '~/composables'
import { OVERLAY_CLOSE, OVERLAY_CLOSE_ALERT } from '~/constants'
import { formDirtyCheck } from '~/application'
import { setValue } from '~/utils'

const { tryToClose, close } = useSharedOverlay()

export const useFormDirtyCheck = createSharedComposable(
  (isDirty: Ref<boolean>, formName: string) => {
    watch(tryToClose, () => {
      if (tryToClose.value === formName) {
        const needConfirm = formDirtyCheck(
          isDirty.value,
          formName,
          tryToClose.value
        )

        if (!needConfirm) {
          setValue(tryToClose, OVERLAY_CLOSE)
          close()
        }

        if (needConfirm) {
          setValue(tryToClose, OVERLAY_CLOSE)
          if (!needConfirm || confirm(OVERLAY_CLOSE_ALERT)) {
            close()
          }
        }
      }
    })
  }
)
