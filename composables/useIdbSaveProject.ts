// FIXME одну функцию сделать
export const useIdbSaveProject = (
  name: string,
  blobs: any,
  directoryHandle: any,
  id: null | number = null
) => {
  const { db } = useIdb()

  if (id) {
    db.projects.update(id, { name, directoryHandle, blobs })
  } else {
    db.projects.add({ name, directoryHandle, blobs })
  }
}
