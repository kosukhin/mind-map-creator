import { Size } from '~/entities'

export const canvasCreateSize = (canvasElement: HTMLElement): Size => {
  return {
    w: canvasElement.clientWidth,
    h: canvasElement.clientHeight,
  }
}
