<script lang="ts" setup>
import { useMiniMap } from '~/composables'

const miniMap = ref<HTMLDivElement>()
const setMiniMap = (vMiniMap) => {
  miniMap.value = vMiniMap
}

const miniMapScreen = ref<HTMLDivElement>()
const setMiniMapScreen = (vMiniMapScreen) => {
  miniMapScreen.value = vMiniMapScreen
}

useMiniMap(miniMap, miniMapScreen)
</script>

<template>
  <div class="TheMiniMap-Wrapper">
    <div :ref="setMiniMap" class="TheMiniMap"></div>
    <div :ref="setMiniMapScreen" class="TheMiniMap-Screen"></div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheMiniMap';
</style>
