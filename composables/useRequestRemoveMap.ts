import { getDirectoryHandler, getFileBlobByName } from '~/libraries/browser-fs'
import { DEFAULT_PROJECT_NAME } from '~/providers/project'

export function useRequestRemoveMap() {
  const router = useRouter()

  const removeMap = (mapName: string) => {
    const fileBlob = getFileBlobByName(mapName) as any
    const name = fileBlob.handle.name
    fileBlob.handle.remove()

    const { getByName } = useIdbGetProject()
    return getByName(DEFAULT_PROJECT_NAME).then((v) => {
      if (v.length) {
        const newBlobs = v[0].blobs.filter((blob: any) => {
          return blob.name !== name
        })

        useIdbSaveProject(
          DEFAULT_PROJECT_NAME,
          newBlobs,
          getDirectoryHandler(),
          v[0].id
        )
        router.back()
      }
    })
  }

  return {
    removeMap,
  }
}
