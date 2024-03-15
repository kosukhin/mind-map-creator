import Dexie from 'dexie'

// FIXME в обычную функцию вынести
const db = new Dexie('MapsDatabase')
db.version(1).stores({
  maps: '++id,name,map',
  projects: '++id,name,directoryHandle,blobs',
})

type DB = Dexie & { maps: any; projects: any }

export const useIdb = () => ({ db } as { db: DB })
