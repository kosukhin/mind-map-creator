<script lang="ts" setup>
import { useMiniMap } from '@/composables/useMiniMap';
import { MINIMAP_SCALE } from '@/constants/system';
import { mapOpened } from '@/domains/data/mapOpened';

const { miniMap, miniMapScreen } = useMiniMap();
const map = mapOpened.value();

const scaledPos = (pos: number) => `${(pos * MINIMAP_SCALE).toFixed(2)}px`;
</script>

<template>
  <div class="absolute bg-white top-[50px] mt-3 right-3 z-1 w-30 h-30 border border-solid border-body-dark">
    <div ref="miniMap" class="TheMiniMap"></div>
    <div ref="miniMapScreen" class="absolute bg-primary/50"></div>
    <div v-if="map">
      <div
        v-for="obj in map.objects"
        :key="obj.id"
        class="absolute w-1 h-1 block bg-danger"
        :style="{
          top: scaledPos(obj.position[1]),
          left: scaledPos(obj.position[0]),
        }"
      ></div>
    </div>
  </div>
</template>
