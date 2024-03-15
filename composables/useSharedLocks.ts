import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useLocalStorage } from '@vueuse/core'

const isClickLocked = ref(false)
const isDragLocked = useLocalStorage('drag-locked', false)
const maybeDragLocked = ref<boolean>(false)

watch(
  isDragLocked,
  () => {
    maybeDragLocked.value = isDragLocked.value
  },
  {
    immediate: true,
  }
)

export const useLocks = () => {
  return {
    isClickLocked,
    isDragLocked,
    maybeDragLocked,
  }
}
