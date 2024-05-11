<script lang="ts" setup>
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { SHOW_PARENT_TYPES } from '@/constants/overlays';
import { svgRender } from '@/utils/svgRenderDefault';
import { overlayController } from '@/modulesHigh/overlay/overlayController';
import { useMapTypes } from '@/app/useMapTypes';

overlayController.autoClose(SHOW_PARENT_TYPES);
const { addType, parentTypes } = useMapTypes();
</script>

<template>
  <div class="AppTypesParent">
    <div v-if="!parentTypes.length">{{ $t('general.noTypes') }}</div>
    <div v-else class="AppTypesParent-Items">
      <div class="flex gap-2 items-end">
        <div
          v-for="item in parentTypes"
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
            class="AppTypesParent-ItemButton e2e-add-parent-type"
            type="success"
            size="sm"
            @click="addType(item)"
          >
            {{ $t('general.addToMap') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
