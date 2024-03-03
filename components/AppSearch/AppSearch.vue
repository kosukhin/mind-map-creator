<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import {
  useSharedMap,
  useSharedOverlay,
  useOverlayAutoClose,
  useMoveToObject,
} from '~/composables'
import { SHOW_SEARCH } from '~/constants'
import { MapObject } from '~/entities'
import BaseInput from '~/components/BaseInput/BaseInput.vue'

useOverlayAutoClose(SHOW_SEARCH)

const query = ref('')
const { map } = useSharedMap()
const searchResults = computed(() => {
  if (!map.value) {
    return []
  }

  if (query.value) {
    const searchQuery = query.value.toLowerCase()
    const objects = Object.values(map.value.objects)
    return objects.filter((object) => {
      return (
        object.name.toLowerCase().includes(searchQuery) ||
        (object.additionalName &&
          object.additionalName.toLowerCase().includes(searchQuery))
      )
    })
  }

  return []
})

const { close } = useSharedOverlay()
const { scrollToObject } = useMoveToObject()
const moveToObject = (object: MapObject) => {
  close()
  scrollToObject(object.id)
}
</script>

<template>
  <div class="AppSearch">
    <BaseInput
      v-model="query"
      autofocus
      class="AppSearch-Input"
      placeholder="Введите запрос"
    />
    <div v-if="searchResults.length" class="AppSearch-Items">
      <div
        v-for="result in searchResults"
        :key="result.name"
        class="AppSearch-Item"
        @click="moveToObject(result)"
      >
        <b class="AppSearch-ItemName">{{ result.name }}</b>
        <b v-if="result.additionalName" class="AppSearch-ItemName">
          &nbsp;
          {{ result.additionalName }}
        </b>
      </div>
    </div>
    <div v-else-if="query">{{ $t('search.noResults') }}</div>
  </div>
</template>

<style scoped lang="scss">
@import 'AppSearch';
</style>
