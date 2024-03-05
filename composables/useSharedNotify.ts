import { watch } from '@vue/runtime-core'
import { createSharedComposable } from '@vueuse/core'
import { NOTIFY_DELAY } from '~/constants'
import { setValue } from '~/utils'

export const useSharedNotify = createSharedComposable(() => {
  const message = ref<[string, string]>()
  watch(message, () => {
    if (message.value) {
      setTimeout(() => {
        setValue(message, null)
      }, NOTIFY_DELAY)
    }
  })

  return {
    message,
  }
})
