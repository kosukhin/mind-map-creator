<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import uniqueId from 'lodash/uniqueId'
import { useSharedMap } from '~/composables'

const { mapName, map } = useSharedMap()
const mapHistory = computed(() => {
  console.log(mapName.value, 'mpname')

  let link = ''
  const result: any = map.map((vMap) => {
    return mapName.value.split('/').map((history) => {
      link += '/' + history
      return {
        link,
        name: vMap?.parentNames?.[history] ?? history,
      }
    })
  }).value
  map.map((vMap) => {
    console.log(vMap.settings.title)

    result[result.length - 1].name = vMap.settings.title
  })
  return result
})
</script>

<template>
  <div v-if="mapHistory">
    <NuxtLink to="/">{{ $t('breadcrumbs.home') }}</NuxtLink>
    <span
      v-for="history in mapHistory"
      :key="history ? history.link : uniqueId('history_')"
    >
      /
      <NuxtLink v-if="history" :to="history.link">
        {{ history.name }}
      </NuxtLink>
    </span>
  </div>
</template>
