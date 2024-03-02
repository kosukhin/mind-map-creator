<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useSeoMeta } from '@vueuse/head'
import { directoryOpen } from 'browser-fs-access'
import debounce from 'lodash/debounce'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import BaseInput from '~/components/BaseInput/BaseInput.vue'
import { useRequestCreateMap, useRequestSearch } from '~/composables'
import { setFiles, topMaps } from '~/libraries/browser-fs'
import { urlTrim } from '~/utils'

// TODO подумать как сохранять пути к проектам открытым ранее
// TODO баг при открытии внешних ссылок
// TODO баг в вычислении позиции предпросмотра
// TODO хлебные крошки не работают
// TODO на главной странице нужно читтаь названия файлов
// TODO поисковый индекс нужно исправить

const i18n = useI18n()
useSeoMeta({
  title: i18n.t('pageMain.mainTitle'),
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
}

const onOpenFiles = async () => {
  const blobs = await directoryOpen({
    recursive: true,
    mode: 'readwrite',
  })
  setFiles(blobs as File[])
}
</script>

<template>
  <div class="PageMain scrollable">
    <h2 class="PageMain-Title">Mind-Map-Creator</h2>
    <BaseButton @click="onOpenFiles">Открыть проект</BaseButton>
    <template v-if="topMaps.length">
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
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import 'PageMain';
</style>
