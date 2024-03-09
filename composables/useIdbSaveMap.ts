export const useIdbSaveMap = (
  name: string,
  content: string,
  id: null | number = null
) => {
  const { db } = useIdb()

  if (id) {
    db.maps.update(id, { name, content })
  } else {
    db.maps.add({ name, content })
  }
}
