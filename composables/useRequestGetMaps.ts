import { GetMapsResponse } from '~/entities'

export function useRequestGetMaps() {
  const getMaps = async (): Promise<GetMapsResponse> => {
    return await Promise.resolve({
      ok: true,
      progress: {},
      favorites: {},
      files: [{ name: 'string', url: 'string' }],
    })
  }

  return {
    getMaps,
  }
}
