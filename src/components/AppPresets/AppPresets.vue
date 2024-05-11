<script lang="ts" setup>
import { SHOW_PRESETS } from '@/constants/overlays';
import { presetsCommon } from '@/constants/presets';
import { svgRender } from '@/utils/svgRenderDefault';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { overlayController } from '@/modulesHigh/overlay/overlayController';
import { useMapTypes } from '@/app/useMapTypes';

overlayController.autoClose(SHOW_PRESETS);
const { addType } = useMapTypes();
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
          class="AppTypesParent-ItemButton e2e-add-preset-type"
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
