<script lang="ts" setup>
import { useStorage } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { watch } from '@vue/runtime-core';
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.vue';
import { SHOW_HISTORY_MAPS } from '@/constants/overlays';
import { HISTORY_STORAGE_KEY } from '@/constants/system';
import { useMeta } from '@/composables/useMeta';
import BaseTextTitle from '@/components/BaseText/BaseTextTitle.vue';
import { overlayController } from '@/modulesHigh/overlay/overlayController';

overlayController.autoClose(SHOW_HISTORY_MAPS);

const MAX_HISTORY_ITEMS = 20;
const mapsHistory = useStorage<{ url: string; title: string }[]>(
  HISTORY_STORAGE_KEY,
  [],
);
const route = useRoute();
const { head } = useMeta();
watch(head, () => {
  const currentMapIndex = mapsHistory.value.findIndex(
    (item) => item.url === route.path,
  );
  if (currentMapIndex !== -1) {
    mapsHistory.value.splice(currentMapIndex, 1);
  }
  mapsHistory.value.unshift({
    url: route.path,
    title: String(head.title),
  });
  mapsHistory.value = mapsHistory.value.slice(0, MAX_HISTORY_ITEMS);
});
</script>

<template>
  <BaseDrawer :name="SHOW_HISTORY_MAPS" direction="rtl">
    <template #header>
      <BaseTextTitle>
        {{ $t('general.visitHistory') }}
      </BaseTextTitle>
    </template>
    <div>
      <ul>
        <li
          v-for="(history, index) in mapsHistory"
          :key="index"
          class="TheHistoryMaps-Item"
        >
          <RouterLink :to="history.url">{{ history.title }}</RouterLink>
          ({{ history.url }})
        </li>
      </ul>
    </div>
  </BaseDrawer>
</template>
