<script lang="ts" setup>
import { idbGet } from '@/application/idbGet';
import { windowReload } from '@/application/windowReload';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useIdbGetMap } from '@/composables/useIdbGetMap';
import { useOpenFile } from '@/composables/useOpenFile';
import { useProject } from '@/composables/useProject';
import { useRequestCreateMap } from '@/composables/useRequestCreateMap';
import { useRequestSearch } from '@/composables/useRequestSearch';
import { setFiles, topMaps } from '@/libraries/browser-fs';
import { urlTrim } from '@/utils/common';
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useSeoMeta } from '@vueuse/head';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

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

const newMapName = ref('');
const { createMap } = useRequestCreateMap();
const onCreateMap = async () => {
  await createMap(newMapName.value);
};

const {
  isProjectOpened, loadProjectFiles,
} = useProject();
[!isProjectOpened.value].filter(Boolean).forEach(loadProjectFiles);

const onCloseProject = () => {
  idbGet().delete().then(windowReload);
};

useIdbGetMap()
  .getMaps()
  .then((v: any) => {
    const files = v.map((item: any) => {
      const file = new File([item.content], item.name) as any;
      file.persistent = true;
      return file;
    });

    setFiles(files);
  });
</script>

<template>
  <div class="PageMain scrollable flex justify-center h-dvh items-center text-center">
    <h2 class="PageMain-Title flex items-center flex-col gap-3">
      <img src="/icon-192x192.png" width="100" height="100" alt="mmc" />
      Mind Map Creator
    </h2>
    <div v-if="isProjectOpened" class="PageMain-ButtonGroup">
      <BaseButton @click="onCloseProject"> Закрыть проект </BaseButton>
    </div>
    <div v-if="isProjectOpened" class="PageMain-NewMap">
      <BaseInput
        v-model="newMapName"
        :placeholder="$t('general.specifyNewCardName')"
      />
      <BaseButton class="PageMain-Button" type="primary" @click="onCreateMap">
        {{ $t('general.create') }}
      </BaseButton>
    </div>
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
