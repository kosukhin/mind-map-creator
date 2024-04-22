<script lang="ts" setup>
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_PRESETS } from '@/constants/overlays';
import { presetsCommon } from '@/constants/presets';
import { svgRender } from '@/utils/svgRenderDefault';
import { useMap } from '@/composables/useMap';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { doWith } from '@/utils/doWith';
import { watch } from 'vue';
import { isTruthy } from '@/utils/isTruthy';
import { ensureThen } from '@/utils/ensureThen';
import { ref } from '@vue/reactivity';
import { MapType } from '@/entities/Map';
import { assocPath, compose, view } from 'ramda';
import { lensValue } from '@/utils/lensValue';
import { lensName } from '@/utils/lensName';
import { useState } from '@/composables/useState';

useOverlayAutoClose(SHOW_PRESETS);

const { map, withMap } = useMap();
const [, setMap] = useState(map);

const [typeToAdd, setTypeToAdd] = useState(ref<MapType>());
const withTypeToAdd = doWith(typeToAdd);
const viewValueName = compose(view(lensName), view(lensValue));

const addTypeToMap = () => setMap(assocPath(
  ['types', withTypeToAdd(viewValueName) as any],
  withTypeToAdd(view(lensValue)),
  withMap(view(lensValue)),
));
const forExistedMap = ensureThen(withMap(compose(isTruthy, view(lensValue))));

watch(typeToAdd, () => forExistedMap(addTypeToMap));
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
          @click="setTypeToAdd(item)"
        >
          {{ $t('general.addToMap') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
