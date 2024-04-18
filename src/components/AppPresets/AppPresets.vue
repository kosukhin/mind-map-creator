<script lang="ts" setup>
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_PRESETS } from '@/constants/overlays';
import { presetsCommon } from '@/constants/presets';
import { svgRender } from '@/utils/svgRenderDefault';
import { useMap } from '@/composables/useMap';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { doWith } from '@/utils/doWith';
import { unref, watch } from 'vue';
import { get, set } from 'lodash';
import partial from 'lodash/partial';
import { compose } from 'lodash/fp';
import { isTruthy } from '@/utils/isTruthy';
import { ensureThen } from '@/combinators/ensureThen';
import { computedParams } from '@/utils/computedParams';
import { tap } from 'ramda';
import { debug } from '@/utils/debug';
import { ref } from '@vue/reactivity';
import { MapType } from '@/entities/Map';

useOverlayAutoClose(SHOW_PRESETS);

const { map } = useMap();
const withMap = doWith(map);

const typeToAdd = ref<MapType>();
const withTypeToAdd = doWith(typeToAdd);

const typesPath = partial(get, partial.placeholder, 'types', []);
const namePath = partial(get, partial.placeholder, 'name', '');
const mapTypes = withMap(compose(typesPath, unref));
const mapExisted = withMap(compose(isTruthy, unref));

console.log('map existed', mapExisted());

const addType = compose(
  partial(
    ensureThen,
    mapExisted,
    computedParams(set, mapTypes, withTypeToAdd(namePath)),
  ),
  tap(partial(debug, 'имя')),
  namePath,
);

watch(typeToAdd, addType);

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
          @click="typeToAdd = item"
        >
          {{ $t('general.addToMap') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
