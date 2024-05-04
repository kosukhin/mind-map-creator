<script lang="ts" setup>
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_PRESETS } from '@/constants/overlays';
import { presetsCommon } from '@/constants/presets';
import { svgRender } from '@/utils/svgRenderDefault';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useMap } from '@/composables/useMap';
import { mapTypeAdd } from '@/domains/map';
import { setRef } from '@/utils/setRef';
import { applyTo, pipe, view } from 'ramda';
import { lensValue } from '@/utils/lensValue';
import { MapType } from '@/entities/Map';

useOverlayAutoClose(SHOW_PRESETS);

const { withMap } = useMap();
const addType = (mapType: MapType) => applyTo(mapType, pipe(
  withMap(pipe(view(lensValue), mapTypeAdd)),
  withMap(setRef),
));
</script>

<template>
  <div class="AppPresets">
    <div class="text-md font-bold mb-2">Общие</div>
    <div class="flex gap-2 items-end">
      <div
        v-for="item in presetsCommon"
        :key="item.name"
        class="flex flex-col gap-2"
      >
        <div class="AppTypesParent-ItemTitle">{{ item.name }}</div>
        <div
          class="AppTypesParent-ItemImage"
          v-html="svgRender(item.svg)"
          :style="`width:${item.width}px;height:${item.height}px`"
        ></div>
        <BaseButton
          class="AppTypesParent-ItemButton"
          type="success"
          size="sm"
          @click="addType(item)"
        >
          {{ $t('general.addToMap') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
