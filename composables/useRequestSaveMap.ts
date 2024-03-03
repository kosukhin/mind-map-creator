import { MapStructure } from '~/entities'
import { getFileBlobByName, updateBlobContent } from '~/libraries/browser-fs'

export function useRequestSaveMap() {
  const saveMap = async (map: MapStructure, mapName: string): Promise<void> => {
    const fileBlob = getFileBlobByName(mapName) as any

    if (fileBlob) {
      const writable = await fileBlob.handle.createWritable()
      const content = JSON.stringify(map)
      await writable.write(content)
      await writable.close()
      updateBlobContent(fileBlob, content)
    }
  }

  return {
    saveMap,
  }
}
