<script lang="ts" setup>
import { useMiniMap } from '~/composables'

const miniMap = ref()

const miniMapScreen = ref()

onMounted(() => {
  if (miniMap.value && miniMapScreen.value) {
    useMiniMap(miniMap.value, miniMapScreen.value)
  }
})
</script>

<template>
  <div class="TheMiniMap-Wrapper">
    <div :ref="miniMap" class="TheMiniMap"></div>
    <div :ref="miniMapScreen" class="TheMiniMap-Screen"></div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheMiniMap';
</style>
