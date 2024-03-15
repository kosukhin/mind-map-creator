<script lang="ts" setup>
import svg64 from 'svg64'
import { useMap, useOverlayAutoClose } from '~/composables'
import { SHOW_PARENT_TYPES } from '~/constants'
import { MapType } from '~/entities'
import BaseButton from '~/components/BaseButton/BaseButton.vue'

useOverlayAutoClose(SHOW_PARENT_TYPES)

const { map, parentTypes } = useMap()
const addType = (type: MapType) => {
  if (map.value) {
    map.value.types[type.name] = type
  }
}
</script>

<template>
  <div class="AppTypesParent">
    <div v-if="!parentTypes.length">{{ $t('typesParent.noTypes') }}</div>
    <div v-else class="AppTypesParent-Items">
      <div
        v-for="item in parentTypes"
        :key="item.name"
        class="AppTypesParent-Item"
      >
        <div class="AppTypesParent-ItemTitle">{{ item.name }}</div>
        <img class="AppTypesParent-ItemImage" :src="svg64(item.svg)" alt="" />
        <BaseButton
          class="AppTypesParent-ItemButton"
          type="success"
          @click="addType(item)"
        >
          {{ $t('typesParent.addToMap') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'AppTypesParent';
</style>
