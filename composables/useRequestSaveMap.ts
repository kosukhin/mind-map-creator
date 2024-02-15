import { MapStructure } from '~/entities'
import { getFileBlobByName } from '~/libraries/browser-fs'

export function useRequestSaveMap() {
  const saveMap = async (map: MapStructure, mapName: string): Promise<void> => {
    const fileBlob = getFileBlobByName(mapName) as any
    console.log('save the map', fileBlob)
    // fileSave(fileBlob)

    if (fileBlob) {
      const writable = await fileBlob.handle.createWritable()
      await writable.write(JSON.stringify(map))
      await writable.close()
    } else {
      console.log('create new file')
    }

    // TODO сохранение доделать
    // await http<Map>({
    //   method: POST,
    //   url: API_SAVE_MAP,
    //   params: {
    //     document: mapName,
    //   },
    //   data: { document: map.document, structure: map },
    // } as const)
  }

  return {
    saveMap,
  }
}
