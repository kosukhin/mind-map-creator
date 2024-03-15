import { ref } from '@vue/reactivity'

const isSidebarOpen = ref(false)

export const useSideBar = () => {
  return {
    isSidebarOpen,
  }
}
