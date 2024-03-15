import { reactive } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { ReactiveHead, useSeoMeta } from '@vueuse/head'
import { useMap } from '~/composables'

const head = reactive<ReactiveHead>({
  title: 'Идет загрузка...',
})
useSeoMeta(head)

const { firstMapLoad, map } = useMap()

watch(firstMapLoad, () => {
  if (map.value) {
    head.title = map.value.settings.title
  }
})

export const useMeta = () => {
  return {
    head,
  }
}
