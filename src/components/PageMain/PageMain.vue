<script lang="ts" setup>
import { useRequestSearch } from '@/composables/useRequestSearch';
import { topMaps } from '@/libraries/browser-fs';
import { urlTrim } from '@/utils/common';
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useSeoMeta } from '@vueuse/head';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
useSeoMeta({
  title: i18n.t('general.mainTitle'),
});

const { search } = useRequestSearch();
const searchQuery = ref('');
const lastSearchDate = ref('');
const searchResults = ref<{ url: string; name: string }[]>([]);

watch(
  searchQuery,
  debounce(async () => {
    if (!searchQuery.value) {
      return;
    }

    const result = await search(searchQuery.value);
    lastSearchDate.value = new Date().toLocaleString();

    if (result.response.length) {
      searchResults.value = result.response.map((res) => {
        const parts = res.ref.split('|');
        return {
          name: parts[0],
          url: urlTrim(parts[1]),
        };
      });
    } else {
      searchResults.value = [];
    }
  }, 500),
);

const topMapsWithNames = ref<any>([]);
const favorites = ref<any>({});
const favoriteGroups = ref<string[]>([]);
</script>

<template>
  <div class="PageMain scrollable flex justify-center h-dvh items-center text-center">
    <h2 class="PageMain-Title flex items-center flex-col gap-3">
      <img src="/icon-192x192.png" width="100" height="100" alt="mmc" />
      Mind Map Creator
    </h2>
    <template v-if="topMaps.length">
      <br />
      <div v-if="lastSearchDate" class="PageMain-Row">
        {{ $t('general.lastSearchTime') }}: {{ lastSearchDate }}
      </div>
      <div
        v-for="result in searchResults"
        :key="result.url + result.name"
        class="PageMain-Row"
      >
        <a :href="result.url">{{ result.name }}</a>
        [{{ result.url }}]
      </div>
      <h3 class="PageMain-SubTitle">{{ $t('general.favorites') }}</h3>
      <div>
        <div v-for="group in favoriteGroups" :key="group">
          <b>{{ group }}</b
          >:
          <span v-for="favorite in favorites[group]" :key="favorite.url">
            <RouterLink :to="favorite.url">{{ favorite.title }}</RouterLink>
            &nbsp;
          </span>
          <p>&nbsp;</p>
        </div>
      </div>
      <h3 class="PageMain-SubTitle">{{ $t('general.existedMaps') }}</h3>
      <div class="PageMain-Files">
        <div
          v-for="file in topMapsWithNames"
          :key="file.url + file.title"
          class="PageMain-File"
        >
          <RouterLink :to="file.url">{{ file.title }}</RouterLink>
        </div>
      </div>
      <br />
      <hr />
      <br />
    </template>
  </div>
</template>
