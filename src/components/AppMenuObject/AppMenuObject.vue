<script lang="ts" setup>
import { useMoveToObject } from '@/composables/useMoveToObject';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_OBJECT_MENU } from '@/constants/overlays';
import { computed } from 'vue';
import { compose } from 'ramda';
import { mapMenuObjects } from '@/domains/map';

useOverlayAutoClose(SHOW_OBJECT_MENU);

const { withMap } = useMap();
const menuItems = computed(() => withMap(mapMenuObjects));

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
