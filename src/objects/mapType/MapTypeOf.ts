import { MapTypeStructure } from '@/entities/MapStructures';
import { BaseChannel } from '@/objects/base/BaseChannel';
import { BaseChannelOf } from '@/objects/base/BaseChannelOf';
import { MapType } from '@/objects/mapType/MapType';

/**
 * Конвертация структуры типа карты в объект
 */
export class MapTypeOf implements MapType {
  private innerChannel = new BaseChannelOf<MapTypeStructure>()

  public constructor(private mapTypeStructure: MapTypeStructure) {}

  public channel(): BaseChannel<MapTypeStructure> {
    return this.innerChannel;
  }

  public entity(): MapTypeStructure {
    return this.mapTypeStructure;
  }
}
