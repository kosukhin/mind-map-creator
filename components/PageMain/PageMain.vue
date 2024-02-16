<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import debounce from 'lodash/debounce'
import { watch } from '@vue/runtime-core'
import { useSeoMeta } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { directoryOpen } from 'browser-fs-access'
import { calculateProgressBg, urlTrim } from '~/utils'
import { useRequestCreateMap, useRequestSearch } from '~/composables'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import BaseInput from '~/components/BaseInput/BaseInput.vue'
import { HISTORY_STORAGE_KEY } from '~/constants'
import { maps, topMaps, setFiles } from '~/libraries/browser-fs'

const i18n = useI18n()
useSeoMeta({
  title: i18n.t('pageMain.mainTitle'),
})

const progress = computed(() => {
  const max = Math.max(...Object.values(maps.progress))

  return Object.fromEntries(
    Object.entries(maps.progress)
      .map(([key, value]) => {
        value = Math.round((value * 100) / max)
        const decimal = value / 100
        const color = calculateProgressBg(decimal)
        return [
          key,
          {
            value,
            decimal,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          },
        ]
      })
      .reverse()
  )
})

const { search } = useRequestSearch()
const searchQuery = ref('')
const lastSearchDate = ref('')
const searchResults = ref<{ url: string; name: string }[]>([])
watch(
  searchQuery,
  debounce(async () => {
    if (!searchQuery.value) {
      return
    }

    const result = await search(searchQuery.value)
    lastSearchDate.value = new Date().toLocaleString()

    if (result.response.length) {
      searchResults.value = result.response.map((res) => {
        const parts = res.ref.split('|')
        return {
          name: parts[0],
          url: urlTrim(parts[1]),
        }
      })
    } else {
      searchResults.value = []
    }
  }, 500)
)

const newMapName = ref('')
const { createMap } = useRequestCreateMap()
const onCreateMap = async () => {
  await createMap(newMapName.value)
  // if (response.ok) {
  //   location.href = `/${response.document}`
  // }
}

// TODO временный код перенести, сделать нужно модалку если нет доступа к ФС
const onOpenFiles = async () => {
  const blobs = await directoryOpen({
    recursive: true,
    mode: 'readwrite',
  })
  setFiles(blobs as File[])
}

const mapsHistory = useStorage<{ url: string; title: string }[]>(
  HISTORY_STORAGE_KEY,
  []
)
</script>

<template>
  <div class="PageMain scrollable">
    <h2 class="PageMain-Title">Mind-Map-Creator</h2>
    <BaseButton @click="onOpenFiles">Открыть проект</BaseButton>
    <br />
    <div class="PageMain-Row">
      <a href="/api/create-search-index" target="_blank">
        {{ $t('pageMain.updateIndex') }}
      </a>
    </div>
    <div class="PageMain-Row">
      <BaseInput v-model="searchQuery" placeholder="Поиск в картах" />
    </div>
    <div v-if="lastSearchDate" class="PageMain-Row">
      {{ $t('pageMain.lastSearchTime') }}: {{ lastSearchDate }}
    </div>
    <div
      v-for="result in searchResults"
      :key="result.url + result.name"
      class="PageMain-Row"
    >
      <a :href="result.url">{{ result.name }}</a>
      [{{ result.url }}]
    </div>
    <h3 class="PageMain-SubTitle">Избранное</h3>
    <div>
      <div v-for="(links, group) in maps.favorites" :key="group">
        <b>{{ group }}</b
        >:
        <span v-for="(title, url) in links" :key="url">
          <a :href="url">{{ title }}</a>
          &nbsp;
        </span>
        <p>&nbsp;</p>
      </div>
    </div>
    <h3 class="PageMain-SubTitle">{{ $t('pageMain.existedMaps') }}</h3>
    <div class="PageMain-Files">
      <div
        v-for="file in topMaps"
        :key="file.url + file.name"
        class="PageMain-File"
      >
        <NuxtLink :to="file.url">{{ file.name }}</NuxtLink>
      </div>
    </div>
    <br />
    <hr />
    <br />
    <div class="PageMain-NewMap">
      <BaseInput
        v-model="newMapName"
        :placeholder="$t('pageMain.specifyNewCardName')"
      />
      <BaseButton class="PageMain-Button" type="primary" @click="onCreateMap">
        {{ $t('pageMain.create') }}
      </BaseButton>
    </div>
    <br />
    <hr />
    <br />
    <h3 class="PageMain-SubTitle">{{ $t('pageMain.visitHistory') }}</h3>
    <div class="PageMain-Files">
      <a
        v-for="(his, index) in mapsHistory"
        :key="'history' + index"
        :href="his.url"
        class="PageMain-File"
      >
        {{ his.title }}
      </a>
    </div>
    <br />
    <h3 class="PageMain-SubTitle">{{ $t('pageMain.progressStatistic') }}</h3>
    <div class="PageMain-Bars">
      <div
        v-for="(bar, index) in progress"
        :key="index"
        :style="`height: ${bar.value}%;background: ${bar.color}`"
        class="PageMain-Bar"
      >
        <p>{{ bar.value }}%</p>
        <p>
          {{ index }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'PageMain';
</style>
