import { Cache } from '@/modules/system/guest/Cache';
import {
  MapDocument,
  MapObjectDocument,
} from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { MapObjectsType } from '@/modules/application/l1/l2/l3/map/mapObject/MapObjectType';
import { LayerBase } from '@/modules/application/l1/l2/l3/types/LayerBase';
import { BrowserCanvas } from '@/modules/integration/browser/canvas/BrowserCanvas';
import { SizeDocument } from '@/modules/application/l1/l2/l3/map/documents/SizeDocument';
import { debug } from 'debug';
import { PointDocument } from '@/modules/application/l1/l2/l3/map/documents/PointDocument';
import { GuestType } from '@/modules/system/guest/GuestType';
import { FactoryType } from '@/modules/system/guest/FactoryType';
import { ChainType } from '@/modules/system/guest/ChainType';
import { MapFileType } from '@/modules/application/l1/l2/l3/map/mapFile/MapFileType';

const localDebug = debug('app:MapObjectsVisible');
type ChainGuestExecutor = (props: {position: PointDocument, size: SizeDocument, map: MapDocument}) => void;

/**
 * Объект для определения видимых объектов
 */
export class MapObjectsVisible implements MapObjectsType {
  private visibleObjectsCache = new Cache<MapObjectDocument[]>(this);

  public constructor(
    layerDep: LayerBase,
    canvas: BrowserCanvas,
    mapFile: MapFileType,
    factories: {
      chain: FactoryType<ChainType<unknown>>,
      patron: FactoryType<GuestType<unknown>>,
      guest: FactoryType<GuestType<unknown>>,
    },
  ) {
    localDebug('constructor initialized');
    const chain = factories.chain.create();
    canvas.size(factories.patron.create(chain.receiveKey('size')));
    layerDep.position(factories.patron.create(chain.receiveKey('position')));
    mapFile.currentMap(factories.patron.create(chain.receiveKey('map')));
    chain.result(factories.patron.create(
      factories.guest.create<[ChainGuestExecutor]>(({ position, size, map }) => {
        const objects = Object.values(map.objects);
        localDebug('objects come to result', objects);

        const visibleObjects = objects.filter((object) => {
          const type = map.types[object.type] ?? {};
          const objectSize = {
            width: object.width || type.width,
            height: object.height || type.height,
          };
          return this.isInBounding(position, size, object.position, objectSize);
        });
        localDebug('visible objects calculated', visibleObjects);
        this.visibleObjectsCache.receive(visibleObjects);
      }),
    ));
  }

  public objects(guest: GuestType<MapObjectDocument[]>) {
    this.visibleObjectsCache.receiving(guest);
    return this;
  }

  private isInBounding(
    layerPosition: PointDocument,
    size: SizeDocument,
    position: [number, number],
    objectSize: SizeDocument,
  ) {
    const stageStartX = layerPosition.x;
    const stageEndX = layerPosition.x - size.width;
    const stageStartY = layerPosition.y;
    const stageEndY = layerPosition.y - size.height;
    const [objectX, objectY] = position;
    localDebug(
      'bounding vars',
      stageStartX,
      stageEndX,
      stageStartY,
      stageEndY,
    );
    localDebug('object position', position);
    return (
      stageStartX > -objectX - objectSize.width
      && -objectX > stageEndX
      && stageStartY > -objectY - objectSize.height
      && -objectY > stageEndY
    );
  }
}
