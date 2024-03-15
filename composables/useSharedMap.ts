import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { mapNormalizeBeforeSave } from '~/application'
import { useRequestGetMap, useRequestSaveMap, useNotify } from '~/composables'
import { MAP_UPDATED, NOTIFY_ERROR, NOTIFY_SUCCESS } from '~/constants'
import { MapStructure, MapType } from '~/entities'
import { setError, setValue, setValues } from '~/utils'

const { message } = useNotify()
const firstMapLoad = ref(false)
const parentTypes = ref<MapType[]>([])
const map = ref<MapStructure>()
const mapError = ref({ error: null })
const route = useRoute()
const mapName = ref(route.path.replace('/', ''))
const { getMap } = useRequestGetMap()
const { saveMap } = useRequestSaveMap()

watch(
  map,
  () => {
    if (map.value) {
      const normalMap = mapNormalizeBeforeSave(map.value, location.pathname)
      saveMap(normalMap, mapName.value)
        .then(() => {
          setValue(message, [MAP_UPDATED, NOTIFY_SUCCESS])
        })
        .catch((e) => {
          setError(mapError.value, String(e))
          setValue(message, [mapError.value.error, NOTIFY_ERROR])
        })
    }
  },
  {
    deep: true,
  }
)

watch(
  route,
  () => {
    firstMapLoad.value = false
    mapName.value = route.path.replace('/', '').replaceAll('/', '_')

    if (mapName.value.match('_')) {
      mapName.value = '_' + mapName.value
    }

    getMap(mapName.value)
      .then(([vMap, vParentTypes]) => {
        setValues([
          [map, vMap],
          [parentTypes, vParentTypes],
          [firstMapLoad, true],
        ])
      })
      .catch(setError(mapError.value))
  },
  {
    immediate: true,
  }
)

export const useMap = () => {
  return {
    map,
    firstMapLoad,
    parentTypes,
    mapName,
  }
}
