import { addFiles, getDirectoryHandler } from '~/libraries/browser-fs'
import { DEFAULT_PROJECT_NAME } from '~/providers/project'
import { createMap as newMap } from '~/utils'

const { getByName } = useIdbGetProject()

export function useRequestCreateMap() {
  const createMap = async (mapName: string, withPush = true): Promise<void> => {
    const directoryHandler = getDirectoryHandler()

    if (directoryHandler && mapName) {
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

      getByName(DEFAULT_PROJECT_NAME).then((v: any) => {
        if (v[0]) {
          useIdbSaveProject(
            DEFAULT_PROJECT_NAME,
            [...v[0].blobs, fileHandle],
            getDirectoryHandler(),
            v[0].id
          )
        }
      })

      withPush && useRouter().push('/' + map.url)
    }
  }

  return {
    createMap,
  }
}
