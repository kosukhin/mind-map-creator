<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { useSharedMap } from '~/composables'

const { mapName, map } = useSharedMap()
const mapHistory = computed(() => {
  let link = ''
  const result: any = map.map((vMap) => {
    return mapName.split('/').map((history) => {
      link += '/' + history
      return {
        link,
        name: vMap?.parentNames?.[history] ?? history,
      }
    })
  }).value
  map.map((vMap) => {
    result[result.length - 1].name = vMap.settings.title
  })
  return result
})
</script>

<template>
  <div>
    <a href="/">{{ $t('breadcrumbs.home') }}</a>
    <span
      v-for="history in mapHistory"
      :key="history ? history.name + history.link : 'none'"
    >
      /
      <a v-if="history" :href="history.link">
        {{ history.name }}
      </a>
    </span>
  </div>
</template>
