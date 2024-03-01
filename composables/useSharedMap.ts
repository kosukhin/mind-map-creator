import { useRoute } from 'vue-router'
import { createSharedComposable } from '@vueuse/core'
import { reactive, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { MapStructure, MapType } from '~/entities'
import {
  useSharedNotify,
  useRequestGetMap,
  useRequestSaveMap,
} from '~/composables'
import { MAP_UPDATED, NOTIFY_ERROR, NOTIFY_SUCCESS } from '~/constants'
import { setError, setValue, setValues, MaybeError } from '~/utils'
import { mapNormalizeBeforeSave } from '~/application'

export const useSharedMap = createSharedComposable(() => {
  const { message } = useSharedNotify()
  const firstMapLoad = ref(false)
  const parentTypes = ref<MapType[]>([])
  const map = reactive(MaybeError<MapStructure>())
  const route = useRoute()
  const mapName = ref(route.path.replace('/', ''))
  const { getMap } = useRequestGetMap()
  const { saveMap } = useRequestSaveMap()

  const { createLayer } = useSharedLayer()

  watch(
    map,
    () => {
      map.map((vMap) => {
        const normalMap = mapNormalizeBeforeSave(vMap, location.pathname)
        saveMap(normalMap, mapName.value)
          .then(() => {
            setValue(message, [MAP_UPDATED, NOTIFY_SUCCESS])
          })
          .catch((e) => {
            setError(map, String(e))
            setValue(message, [map.error, NOTIFY_ERROR])
          })
      })
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
        .catch(setError(map))
    },
    {
      immediate: true,
    }
  )

  return {
    map,
    firstMapLoad,
    parentTypes,
    mapName,
  }
})
