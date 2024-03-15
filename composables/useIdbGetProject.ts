import { useIdb } from '~/composables/useIdb'

const { db } = useIdb()

// FIXME одну функцию сделать
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
