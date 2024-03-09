import { useIdb } from '~/composables/useIdb'

const { db } = useIdb()

export const useIdbGetMap = () => {
  return {
    getByName(name: string): Promise<any> {
      return db.maps.where('name').equals(name).toArray()
    },
    getMaps() {
      return db.maps.toArray()
    },
  }
}
