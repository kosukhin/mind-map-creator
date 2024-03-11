import Dexie from 'dexie'

const db = new Dexie('MapsDatabase')
db.version(1).stores({
  maps: '++id,name,map',
  projects: '++id,name,blobs',
})

export const useIdb = () => ({ db })
