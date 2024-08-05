import { BaseResult } from '@/objects/base/BaseResult';
import { BaseResultParam } from '@/objects/base/BaseResultEntity';
import { Canvas } from '@/objects/canvas/Canvas';

/**
 * Конвертация структуры данных холста в объект
 */
export class CanvasOf implements Canvas {
  private canvas: BaseResult<BaseResultParam<Canvas>>;

  public constructor(canvasStructure: BaseResultParam<Canvas>) {
    this.canvas = new BaseResult(canvasStructure);
  }

  public entity() {
    return this.canvas;
  }
}
