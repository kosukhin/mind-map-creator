import { addFiles, getDirectoryHandler } from '~/libraries/browser-fs'
import { createMap as newMap } from '~/utils'

export function useRequestCreateMap() {
  const createMap = async (mapName: string): Promise<void> => {
    const directoryHandler = getDirectoryHandler()

    if (directoryHandler) {
      const map = newMap('', mapName)

      const fileHandle = await directoryHandler.getFileHandle(
        map.document + '.json',
        {
          create: true,
        }
      )
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(map))
      await writable.close()
      const file: any = await fileHandle.getFile()
      file.handle = fileHandle
      addFiles([file])

      useRouter().push('/' + map.url)
    }
  }

  return {
    createMap,
  }
}
