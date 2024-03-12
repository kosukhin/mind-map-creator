import { ref } from '@vue/reactivity'
import { GetMapsResponse } from '~/entities'
import { documentNormalize } from '~/utils'

export const directoryHandler = ref<FileSystemDirectoryHandle | null>(null)
const files: Record<string, File> = {}
export const maps: GetMapsResponse = reactive({
  ok: true,
  progress: {},
  favorites: {},
  files: [],
})
export const topMaps = computed(() => {
  return maps.files.filter((map: any) => map.name[0] !== '_' || map.persistent)
})

export const onMapsChanged = (fn: Function) => {
  const handler = watch(maps, () => {
    fn(maps)
    handler()
  })
}

export const openDirectory = () => {}

export const addFiles = (blobs: File[]) => {
  blobs.forEach((blob) => {
    files[blob.name] = blob
  })
  maps.files = Object.entries(files).map(([name, file]) => {
    return {
      name,
      url: name.replace('.json', ''),
      persistent: (file as any).persistent,
    }
  })
}

export const setDeirectoryHandle = (handle: any) => {
  directoryHandler.value = handle
}

export const setDirectoryHandleFromBlobs = (blobs: File[]) => {
  const handler = (blobs?.[0] as any)?.directoryHandle
  if (handler) {
    setDeirectoryHandle(handler)
  }
}

export const setFiles = (blobs: File[]) => {
  setDirectoryHandleFromBlobs(blobs)
  blobs.forEach((blob) => {
    files[blob.name] = blob
  })
  maps.files = Object.entries(files).map(([name, file]) => {
    return {
      name,
      url: name.replace('.json', ''),
      persistent: (file as any).persistent,
    }
  })
}

export const getDirectoryHandler = () => directoryHandler.value

const filesContents = new WeakMap()
export const readFile = async (blob: File) => {
  let result = ''
  if (!filesContents.has(blob)) {
    result = await new Response(blob as any).text()
    filesContents.set(blob, result)
  } else {
    result = filesContents.get(blob)
  }
  return result
}

export const updateBlobContent = (blob: File, content: string) => {
  if (filesContents.has(blob)) {
    filesContents.set(blob, content)
  }
}

export const readFileByName = (name: string): Promise<string | null> => {
  name = documentNormalize(name) + '.json'

  if (!files[name]) {
    return Promise.resolve(null)
  }

  return readFile(files[name])
}

export const getFileBlobByName = (name: string) => {
  name += '.json'
  return files[name]
}

export const getFileNames = () => {
  return Object.keys(files)
}
