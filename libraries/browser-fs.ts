import { GetMapsResponse } from '~/entities'

let directoryHandler: FileSystemDirectoryHandle | null = null
const files: Record<string, File> = {}
export const maps: GetMapsResponse = reactive({
  ok: true,
  progress: {},
  favorites: {},
  files: [],
})

export const openDirectory = () => {}

export const setFiles = (blobs: File[]) => {
  if (blobs[0]) {
    directoryHandler = (blobs[0] as any).directoryHandle
  }
  blobs.forEach((blob) => {
    files[blob.name] = blob
  })
  maps.files = getFileNames().map((name) => ({
    name,
    url: name.replace('.json', ''),
  }))
}

export const getDirectoryHandler = () => directoryHandler

export const readFile = async (blob: File) => {
  return await new Response(blob as any).text()
}

export const readFileByName = (name: string): Promise<string | null> => {
  name += '.json'
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
