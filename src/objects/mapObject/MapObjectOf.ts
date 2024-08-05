import { MapObjectStructure } from '@/entities/MapStructures';
import { BaseResult } from '@/objects/base/BaseResult';
import { BaseResultParam } from '@/objects/base/BaseResultEntity';
import { MapObject } from '@/objects/mapObject/MapObject';

/**
 * Конвертация структура объекта карты в объект
 */
export class MapObjectOf implements MapObject {
  private canvas: BaseResult<BaseResultParam<MapObject>>;

  public constructor(mapStructure: MapObjectStructure) {
    this.canvas = new BaseResult(mapStructure);
  }

  public entity() {
    return this.canvas;
  }
}
