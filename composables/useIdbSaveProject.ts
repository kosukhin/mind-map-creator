export const useIdbSaveProject = (
  name: string,
  blobs: any,
  id: null | number = null
) => {
  const { db } = useIdb()

  if (id) {
    db.projects.update(id, { name, blobs })
  } else {
    db.projects.add({ name, blobs })
  }
}
