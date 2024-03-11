import { useIdb } from '~/composables/useIdb'

const { db } = useIdb()

export const useIdbGetProject = () => {
  return {
    getByName(name: string): Promise<any> {
      return db.projects.where('name').equals(name).toArray()
    },
    getList() {
      return db.projects.toArray()
    },
  }
}
