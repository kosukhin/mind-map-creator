<script lang="ts" setup>
import { useMoveToObject } from '@/composables/useMoveToObject';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_OBJECT_MENU } from '@/constants/overlays';
import { computed } from 'vue';
import {
  compose, defaultTo, filter, prop, sort, values, view,
} from 'ramda';
import { isTruthy } from '@/utils/isTruthy';
import { lensValue } from '@/utils/lensValue';
import { lensObjects } from '@/utils/lensObjects';
import { diff } from '@/utils/diff';

useOverlayAutoClose(SHOW_OBJECT_MENU);

const { withMap } = useMap();
const lensValueObjects = compose(lensValue, lensObjects);

const isMenuProp = compose(isTruthy, prop('inMenu'));
const defaultToObject = defaultTo({});
const getObjects = compose(defaultToObject, view(lensValueObjects));
const menuItems = computed(() => sort(diff, filter(
  isMenuProp,
  values(withMap(getObjects)),
)));

const { close } = useOverlay();
const { scrollToObject } = useMoveToObject();

const selectMenuItem = compose(close, scrollToObject);
</script>

<template>
  <div class="AppMenuObject">
    <div v-if="!menuItems.length" class="AppMenuObject-Empty">
      {{ $t('appMenuObject.noItems') }}
    </div>
    <div v-else class="flex flex-col gap-1">
      <a
        v-for="item in menuItems"
        :key="item.id"
        class="AppMenuObject-Item"
        href="#"
        v-html="item.additionalName ? item.additionalName : item.name"
        @click.prevent="selectMenuItem(item.id)"
      >
      </a>
    </div>
  </div>
</template>
