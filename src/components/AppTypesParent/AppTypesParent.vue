<script lang="ts" setup>
import svg64 from 'svg64';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_PARENT_TYPES } from '@/constants/overlays';
import { MapType } from '@/entities/Map';
import { svgRender } from '@/utils/svgRenderDefault';
import { mapOpened } from '@/domains/data/mapOpened';
import { mapParentTypes } from '@/domains/data/mapParentTypes';

useOverlayAutoClose(SHOW_PARENT_TYPES);

const map = mapOpened;
const parentTypes = mapParentTypes;
const addType = (type: MapType) => {
  if (map.value) {
    map.value.types[type.name] = type;
  }
};
</script>

<template>
  <div class="AppTypesParent">
    <div v-if="!parentTypes.length">{{ $t('general.noTypes') }}</div>
    <div v-else class="AppTypesParent-Items">
      <div
        v-for="item in parentTypes"
        :key="item.name"
        class="AppTypesParent-Item"
      >
        <div class="AppTypesParent-ItemTitle">{{ item.name }}</div>
        <img
          class="AppTypesParent-ItemImage"
          :src="svg64(svgRender(item.svg))"
          height="100px"
          width="100px"
          alt=""
        />
        <BaseButton
          class="AppTypesParent-ItemButton"
          type="success"
          @click="addType(item)"
        >
          {{ $t('general.addToMap') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
