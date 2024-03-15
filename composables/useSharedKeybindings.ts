import { ref } from '@vue/reactivity'

const ctrlSFired = ref(0)
const ctrlFFired = ref(0)
const ctrlMFired = ref(0)
const ctrlHFired = ref(0)
const keysMap = {
  KeyS: ctrlSFired,
  KeyF: ctrlFFired,
  KeyM: ctrlMFired,
  KeyH: ctrlHFired,
} as any

document.addEventListener(
  'keydown',
  (e) => {
    if (e.ctrlKey && keysMap[e.code]) {
      e.preventDefault()
      keysMap[e.code].value++
    }
  },
  true
)

export const useKeybindings = () => {
  return {
    ctrlSFired,
    ctrlFFired,
    ctrlMFired,
    ctrlHFired,
  }
}
