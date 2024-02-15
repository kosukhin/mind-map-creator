import { getDirectoryHandler } from '~/libraries/browser-fs'
import { createMap as newMap } from '~/utils'

export function useRequestCreateMap() {
  const createMap = async (mapName: string): Promise<void> => {
    const directoryHandler = getDirectoryHandler()

    if (directoryHandler) {
      const map = newMap('', mapName)
      const fileHandle = await directoryHandler.getFileHandle(
        mapName + '.json',
        {
          create: true,
        }
      )
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(map))
      await writable.close()
    }
  }

  return {
    createMap,
  }
}
