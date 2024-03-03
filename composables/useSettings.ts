import { Settings } from '~/entities'

export function useSettings() {
  const settings = ref<Settings>({
    isEditable: true,
  })

  return {
    settings,
  }
}
