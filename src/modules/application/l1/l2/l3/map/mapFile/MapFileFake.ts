import { MapFileType } from '@/modules/application/l1/l2/l3/map/mapFile/MapFileType';
import { MapDocument, MapFileDocument } from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { PatronPool } from '@/modules/system/guest/PatronPool';
import { GuestType } from '@/modules/system/guest/GuestType';

/**
 * Фейковый объект для получения файла с картами
 */
export class MapFileFake implements MapFileType {
  private currentMapPool = new PatronPool(this);

  private mapFilePool = new PatronPool(this);

  public constructor(
    private mapFileDocument: MapFileDocument,
  ) {}

  public currentMap(target: GuestType<MapDocument>) {
    this.currentMapPool.distribute(
      this.mapFileDocument.current,
      target,
    );
    return target;
  }

  public mapFile(target: GuestType<MapFileDocument>): this {
    this.mapFilePool.distribute(
      this.mapFileDocument,
      target,
    );
    return this;
  }

  public receive(value: MapFileDocument): this {
    this.mapFileDocument = value;
    this.currentMapPool.receive(value.current);
    this.mapFilePool.receive(value);
    return this;
  }
}
