import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'

export const useSharedLocks = createSharedComposable(() => {
  const isClickLocked = ref(false)
  const isDragLocked = useLocalStorage('drag-locked', false)
  const maybeDragLocked = ref<boolean>()
  watch(
    isDragLocked,
    () => {
      maybeDragLocked.value = isDragLocked.value
    },
    {
      immediate: true,
    }
  )

  return {
    isClickLocked,
    isDragLocked,
    maybeDragLocked,
  }
})
