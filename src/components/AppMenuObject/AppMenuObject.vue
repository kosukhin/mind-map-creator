<script lang="ts" setup>
import { useMoveToObject } from '@/composables/useMoveToObject';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_OBJECT_MENU } from '@/constants/overlays';
import { computed } from 'vue';
import {
  ascend, compose, defaultTo, equals, filter, pipe, prop, sort, values, view,
} from 'ramda';
import { lensValue } from '@/utils/lensValue';
import { lensObjects } from '@/utils/lensObjects';

useOverlayAutoClose(SHOW_OBJECT_MENU);

const { withMap } = useMap();
const lensValueObjects = compose(lensValue, lensObjects);

const byInMenu = compose(equals(true), prop('inMenu'));
const defaultToObject = defaultTo({});
const objectsField = compose(values, defaultToObject, view(lensValueObjects));
const byMenuOrder = ascend(prop('menuOrder') as any);

const menuItems = computed(() => withMap(
  pipe(objectsField, filter(byInMenu), sort(byMenuOrder)),
));

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
