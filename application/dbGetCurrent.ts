export const dbGetCurrent = () => {
  const { db } = useIdb()
  return db
}
