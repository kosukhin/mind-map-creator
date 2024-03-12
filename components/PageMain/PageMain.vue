<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useSeoMeta } from '@vueuse/head'
import { directoryOpen, fileOpen } from 'browser-fs-access'
import debounce from 'lodash/debounce'
import { useI18n } from 'vue-i18n'
import { dbGetCurrent } from '~/application/dbGetCurrent'
import { windowReload } from '~/application/windowReload'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import BaseInput from '~/components/BaseInput/BaseInput.vue'
import {
  useRequestCreateMap,
  useRequestSearch,
  useIdbGetProject,
  useIdbSaveProject,
} from '~/composables'
import {
  directoryHandler,
  onMapsChanged,
  setFiles,
  topMaps,
} from '~/libraries/browser-fs'
import { DEFAULT_PROJECT_NAME } from '~/providers/project'
import { urlTrim } from '~/utils'

// TODO Поправить удаление файлов
// TODO поисковый индекс нужно исправить, сохранять индекс в проекте
// TODO подумать как сохранять пути к проектам открытым ранее
// TODO сделать шаблоны внутри SVG чтобы писать текст внутри картинок
// TODO открытие json  файлов с помощью PWA приложения

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

const { getByName } = useIdbGetProject()
const isProjectOpened = ref(false)
getByName(DEFAULT_PROJECT_NAME).then((v) => {
  if (v.length) {
    isProjectOpened.value = true
    setFiles(v[0].blobs)
  }
})

const onOpenFiles = async () => {
  const blobs = await directoryOpen({
    recursive: true,
    mode: 'readwrite',
  })
  setFiles(blobs as File[])

  const project = await getByName(DEFAULT_PROJECT_NAME)
  if (!project.length) {
    isProjectOpened.value = true
    useIdbSaveProject(DEFAULT_PROJECT_NAME, blobs)
  }
}

const router = useRouter()
const onOpenOneFile = async () => {
  const blob = await fileOpen()

  onMapsChanged(async (maps: any) => {
    const lastIndex = maps.files.length - 1
    const mapObject = await getMap(maps.files[lastIndex].url)
    router.push(mapObject[0].url)
  })

  setFiles([blob])
}

const onCloseProject = () => {
  dbGetCurrent().delete().then(windowReload)
}

useIdbGetMap()
  .getMaps()
  .then((v: any) => {
    const files = v.map((item: any) => {
      const file = new File([item.content], item.name) as any
      file.persistent = true
      return file
    })

    setFiles(files)
  })
</script>

<template>
  <div class="PageMain scrollable">
    <h2 class="PageMain-Title">
      <img src="/icon-192x192.png" width="100" height="100" alt="mmc" />
      Mind Map Creator
    </h2>
    <div v-if="!isProjectOpened" class="PageMain-ButtonGroup">
      <BaseButton @click="onOpenFiles">
        {{ $t('general.openProject') }}
      </BaseButton>
      <BaseButton @click="onOpenOneFile">
        {{ $t('general.openFile') }}
      </BaseButton>
    </div>
    <div v-if="isProjectOpened" class="PageMain-ButtonGroup">
      <BaseButton @click="onCloseProject"> Закрыть проект </BaseButton>
    </div>
    <div v-if="directoryHandler" class="PageMain-NewMap">
      <BaseInput
        v-model="newMapName"
        :placeholder="$t('pageMain.specifyNewCardName')"
      />
      <BaseButton class="PageMain-Button" type="primary" @click="onCreateMap">
        {{ $t('pageMain.create') }}
      </BaseButton>
    </div>
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
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import 'PageMain';
</style>
