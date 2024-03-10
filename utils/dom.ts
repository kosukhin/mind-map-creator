export const setElementPosition = (
  element: HTMLElement,
  [top, left]: [number, number]
) => {
  element.style.top = top + 'px'
  element.style.left = left + 'px'
}

export function findById(elementId: string) {
  return document.getElementById(elementId)
}

export function downloadFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}
