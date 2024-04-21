<script lang="ts" setup>
import { useMoveToObject } from '@/composables/useMoveToObject';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_OBJECT_MENU } from '@/constants/overlays';
import { MapObject } from '@/entities/Map';
import { ref, watch } from 'vue';

useOverlayAutoClose(SHOW_OBJECT_MENU);

const { firstMapLoad, map } = useMap();
const menuItems = ref<MapObject[]>([]);

watch(
  firstMapLoad,
  () => {
    if (map.value) {
      menuItems.value = Object.values(map.value.objects)
        .filter((object) => object.inMenu)
        .sort((a, b) => a.menuOrder - b.menuOrder);
    }
  },
  {
    immediate: true,
  },
);

const { close } = useOverlay();
const { scrollToObject } = useMoveToObject();
const selectMenuItem = (id: string) => {
  scrollToObject(id);
  close();
};
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
        @click.prevent="selectMenuItem(item.id)"
      >
        {{ item.additionalName ? item.additionalName : item.name }}
      </a>
    </div>
  </div>
</template>
