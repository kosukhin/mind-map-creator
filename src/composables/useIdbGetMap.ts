import { useIdb } from '@/composables/useIdb';

const { db } = useIdb();

// FIXME одну функцию сделать
export const useIdbGetMap = () => ({
  getByName(name: string): Promise<any> {
    return db.maps.where('name').equals(name).toArray();
  },
  getMaps() {
    return db.maps.toArray();
  },
});
