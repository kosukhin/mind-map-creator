import { MapFileType } from '@/modules/application/l1/l2/l3/map/mapFile/MapFileType';
import { MapFileContentType } from '@/modules/application/l1/l2/l3/map/mapFile/MapFileContentType';
import {
  MapDocument,
  MapFileDocument,
} from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { debug } from 'debug';
import { GuestType } from '@/modules/system/guest/GuestType';
import { FactoryType } from '@/modules/system/guest/FactoryType';
import { PoolType } from '@/modules/system/guest/PoolType';
import { Transformed } from '@/modules/system/transformed/Transformed';
import { MapCurrentIDType } from '@/modules/application/l1/l2/l3/map/mapCurrent/MapCurrentIDType';
import { ChainType } from '@/modules/system/guest/ChainType';
import { CacheType } from '@/modules/system/guest/CacheType';

const localDebug = debug('MapFileOfContent');
type CurrentMapChainProps = {mapId: string, mapFile: MapFileDocument};

/**
 * Объект для получения карты и сохранения всего файла с картами
 */
export class MapFile implements MapFileType {
  private currentMapPatrons: PoolType<MapDocument>;

  private mapFilePatrons: PoolType<MapFileDocument>;

  private mapFileCache: CacheType;

  public constructor(
    private mapFileContent: MapFileContentType,
    private mapId: MapCurrentIDType,
    private factories: {
      pool: FactoryType<PoolType>,
      guest: FactoryType<GuestType>,
      chain: FactoryType<ChainType>,
      guestCast: FactoryType<GuestType>,
      guestInTheMiddle: FactoryType<GuestType>,
      transformToString: FactoryType<Transformed<string>>,
      transformToObject: FactoryType<Transformed>,
      cache: FactoryType<CacheType>
    },
  ) {
    this.currentMapPatrons = factories.pool.create(this);
    this.mapFilePatrons = factories.pool.create(this);
    this.mapFileCache = factories.cache.create(this, false);
  }

  public currentMap<R extends GuestType<MapDocument>>(currentMapGuest: R): R {
    const chain = this.factories.chain.create();
    this.mapId.id(this.factories.guestCast.create(currentMapGuest, chain.receiveKey('mapId')));
    this.mapFile(this.factories.guestCast.create(currentMapGuest, chain.receiveKey('mapFile')));
    chain.result(this.factories.guestInTheMiddle.create(currentMapGuest, ({ mapId, mapFile }: CurrentMapChainProps) => {
      localDebug('get current map', mapId, mapFile, typeof mapFile);
      if (!mapFile[mapId]) {
        this.createEmptyMapByName(mapId, currentMapGuest);
      } else {
        const mapObject = mapFile[mapId];
        this.currentMapPatrons.distribute(mapObject?.structure ? mapObject.structure : mapObject, currentMapGuest);
      }
    }));
    return currentMapGuest;
  }

  public receive(value: MapFileDocument): this {
    localDebug('save map file document', value);
    this.mapFileContent.receive(this.factories.transformToString.create(value).result());
    this.mapFileCache.receive(value);
    return this;
  }

  public mapFile<R extends GuestType<MapFileDocument>>(mapFileTarget: R) {
    this.mapFileCache.receiving(
      this.factories.guestInTheMiddle.create(mapFileTarget, (mapFileCache: MapFileDocument) => {
        if (mapFileCache) {
          mapFileTarget.receive(mapFileCache);
        } else {
          this.mapFileContent.content(this.factories.guest.create((value: string) => {
            const mapFile = this.factories.transformToObject.create(value || this.generateEmptyMapFile()).result();
            localDebug('get map file', mapFile);
            this.mapFileCache.receive(mapFile);
            mapFileTarget.receive(<MapFileDocument>mapFile);
          }));
        }
      }),
    );
    return mapFileTarget;
  }

  private createEmptyMapByName(mapName: string, guest: GuestType<MapDocument>) {
    localDebug('creating empty map by name', mapName);
    const mapFileTemplate = this.factories.transformToObject.create(
      this.generateEmptyMapFile(),
    ).result() as {current: MapDocument};
    this.mapFile(
      this.factories.guest.create((mapFile: MapFileDocument) => {
        this.receive({
          ...mapFile,
          [mapName]: mapFileTemplate.current,
        });
        guest.receive(mapFileTemplate.current);
      }),
    );
  }

  private generateEmptyMapFile(): string {
    return '{"current":{"progress":0,"settings":{"colored":false,"title":"current"},"objects":{},"types":{},"url":"/current","parent":""}}';
  }
}
