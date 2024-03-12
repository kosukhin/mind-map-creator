import { useIdbGetMap } from '~/composables/useIdbGetMap'
import { MapStructure } from '~/entities'
import { getFileBlobByName, updateBlobContent } from '~/libraries/browser-fs'

export function useRequestSaveMap() {
  const saveMap = async (map: MapStructure, mapName: string): Promise<void> => {
    const fileBlob = getFileBlobByName(mapName) as any
    const content = JSON.stringify(map)

    if (fileBlob && fileBlob.handle) {
      const writable = await fileBlob.handle.createWritable()
      await writable.write(content)
      await writable.close()
      updateBlobContent(fileBlob, content)
    } else if (fileBlob) {
      useIdbGetMap()
        .getByName(fileBlob.name)
        .then((v: any) => {
          if (v[0]) {
            useIdbSaveMap(fileBlob.name, content, v[0].id)
          } else {
            useIdbSaveMap(fileBlob.name, content)
          }
        })
    } else {
      const { createMap } = useRequestCreateMap()
      createMap(mapName, false)
    }
  }

  return {
    saveMap,
  }
}
