<script lang="ts" setup>
import { useMiniMap, useSharedMap } from '~/composables'
import { MINIMAP_SCALE } from '~/constants'

const miniMap = ref()
const miniMapScreen = ref()
const { map } = useSharedMap()

onMounted(() => {
  if (miniMap.value && miniMapScreen.value) {
    useMiniMap(miniMap.value, miniMapScreen.value)
  }
})

const scaledPos = (pos: number) => (pos * MINIMAP_SCALE).toFixed(2) + 'px'
</script>

<template>
  <div class="TheMiniMap-Wrapper">
    <div :ref="miniMap" class="TheMiniMap"></div>
    <div :ref="miniMapScreen" class="TheMiniMap-Screen"></div>
    <div v-if="map">
      <div
        v-for="obj in map.objects"
        :key="obj.id"
        class="TheMiniMap-Point"
        :style="{
          top: scaledPos(obj.position[1]),
          left: scaledPos(obj.position[0]),
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheMiniMap';
</style>
