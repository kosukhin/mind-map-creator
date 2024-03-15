import { watch } from '@vue/runtime-core'
import { NOTIFY_DELAY } from '~/constants'
import { setValue } from '~/utils'

const message = ref<[string, string]>()
watch(message, () => {
  if (message.value) {
    setTimeout(() => {
      setValue(message, null)
    }, NOTIFY_DELAY)
  }
})

export const useNotify = () => {
  return {
    message,
  }
}
