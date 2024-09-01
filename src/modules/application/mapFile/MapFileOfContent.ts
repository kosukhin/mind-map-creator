import { MapFile } from '@/modules/application/mapFile/MapFile';
import { MapFileContent } from '@/modules/application/mapFileContent/MapFileContent';
import { MapDocument, MapFileDocument } from '@/modules/entities/MapStructures';
import { Guest } from '@/modules/system/guest/Guest';
import { PatronPool } from '@/modules/system/guest/PatronPool';
import { TransformedFromJSON } from '@/modules/system/transformed/TransformedFromJSON';
import { RuntimeError } from '@/modules/system/error/RuntimeError';
import { TransformedToJSON } from '@/modules/system/transformed/TransformedToJSON';
import { GuestType } from '../../system/guest/GuestType';

export class MapFileOfContent implements MapFile {
  private currentMapPatrons = new PatronPool<MapDocument>(this);

  private mapFilePatrons = new PatronPool<MapFileDocument>(this);

  public constructor(private mapFileContent: MapFileContent) {}

  public currentMap(currentMapGuest: GuestType<MapDocument>): this {
    try {
      const mapFileTarget = new Guest((value: MapFileDocument) => {
        this.currentMapPatrons.distributeReceivingOnce(value.current, currentMapGuest);
      });
      this.mapFile(mapFileTarget);
      return this;
    } catch (e) {
      throw new RuntimeError('Problem while building current map in MapFileBase', { cause: e });
    }
  }

  public receive(value: MapFileDocument): this {
    try {
      this.mapFileContent.receive(new TransformedToJSON(value).result());
      return this;
    } catch (e) {
      throw new RuntimeError('Problem while receiving map file structure in MapFileBase', { cause: e });
    }
  }

  public mapFile(mapFileTarget: GuestType<MapFileDocument>): this {
    try {
      const contentTarget = new Guest<string>((value) => {
        const mapFile = new TransformedFromJSON<MapFileDocument>(value).result();
        this.mapFilePatrons.distributeReceivingOnce(mapFile, mapFileTarget);
      });
      this.mapFileContent.content(contentTarget);
      return this;
    } catch (e) {
      throw new RuntimeError('Problem while building map file document in MapFileBase', { cause: e });
    }
  }
}