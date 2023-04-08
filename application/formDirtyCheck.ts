export const formDirtyCheck =
  (isDirty: boolean, formName: string) => (overlayName: string) => {
    if (overlayName !== formName) {
      return null as boolean
    }

    return isDirty
  }
