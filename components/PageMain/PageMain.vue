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

// TODO Сделать открытие файла, тк на мобиле не работает открытие папки
// TODO Проверить создание новых файлов, там проблемы
// TODO подумать как сохранять пути к проектам открытым ранее
// TODO поисковый индекс нужно исправить, сохранять индекс в проекте
// TODO сделать шаблоны внутри SVG чтобы писать текст внутри картинок

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

const { getMap } = useRequestGetMap()
const topMapsWithNames = ref<any>([])
const favorites = ref<any>({})
const favoriteGroups = ref<string[]>([])

watch(
  topMaps,
  async () => {
    const files = await Promise.all(
      topMaps.value.map((file) => {
        return getMap(file.url)
      })
    )
    topMapsWithNames.value = files.map((f) => ({
      title: f[0].settings.title,
      url: f[0].url,
      favorite: f[0].settings.favoriteGroup,
    }))

    favorites.value = files
      .sort((a: any, b: any) => {
        return String(a[0].settings.title) > String(b[0].settings.title) ? a : b
      })
      .reduce((acc: any, f) => {
        const group = String(f[0].settings.favoriteGroup)
        if (!group || group === 'undefined') {
          return acc
        }

        if (!acc[group]) {
          acc[group] = []
        }

        acc[group].push({
          title: f[0].settings.title,
          url: f[0].url,
        })

        return acc
      }, {})
    favoriteGroups.value = Object.keys(favorites.value).sort()
  },
  {
    immediate: true,
  }
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
      <h3 class="PageMain-SubTitle">{{ $t('general.favorites') }}</h3>
      <div>
        <div v-for="group in favoriteGroups" :key="group">
          <b>{{ group }}</b
          >:
          <span v-for="favorite in favorites[group]" :key="favorite.url">
            <NuxtLink :to="favorite.url">{{ favorite.title }}</NuxtLink>
            &nbsp;
          </span>
          <p>&nbsp;</p>
        </div>
      </div>
      <h3 class="PageMain-SubTitle">{{ $t('pageMain.existedMaps') }}</h3>
      <div class="PageMain-Files">
        <div
          v-for="file in topMapsWithNames"
          :key="file.url + file.title"
          class="PageMain-File"
        >
          <NuxtLink :to="file.url">{{ file.title }}</NuxtLink>
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
