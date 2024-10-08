import { MapType } from '@/modules/application/l1/l2/l3/map/mapCurrent/MapType';
import { LayerBase } from '@/modules/application/l1/l2/l3/types/LayerBase';
import { PointIdDocument } from '@/modules/application/l1/l2/l3/map/documents/PointIdDocument';
import { SizeDocument } from '@/modules/application/l1/l2/l3/map/documents/SizeDocument';
import { PointDocument } from '@/modules/application/l1/l2/l3/map/documents/PointDocument';
import { debug } from 'debug';
import { GuestType } from '@/modules/system/guest/GuestType';
import { CacheType } from '@/modules/system/guest/CacheType';
import { FactoryType } from '@/modules/system/guest/FactoryType';
import { ChainType } from '@/modules/system/guest/ChainType';
import { Layer } from 'konva/lib/Layer';
import { MapObjectDocument } from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { GuestAwareType } from '@/modules/system/guest/GuestAwareType';

const localDebug = debug('app:MiniMap');
const minimapWidth = 130;

type ViewPortChainDocument = {
  size: SizeDocument,
  position: PointDocument
}

type MiniMapChainDocument = {
  layer: Layer,
  size: SizeDocument,
  objects: MapObjectDocument[],
};

type SizablePointDocument = PointIdDocument & SizeDocument;

/**
 * Объект для построения отображения миникарты
 */
export class MiniMap {
  private theSize: CacheType<SizeDocument>;

  private thePoints: CacheType<SizablePointDocument[]>;

  private viewportSizeCache: CacheType<SizeDocument>;

  public constructor(
    private map: MapType,
    private layer: LayerBase,
    private stageSize: GuestAwareType<SizeDocument>,
    private factories: {
      cache: FactoryType<CacheType>,
      chain: FactoryType<ChainType<unknown>>,
      patron: FactoryType<GuestType>,
      guest: FactoryType<GuestType>,
      guestInTheMiddle: FactoryType<GuestType>,
      guestCast: FactoryType<GuestType>
    },
  ) {
    this.theSize = factories.cache.create(this);
    this.thePoints = factories.cache.create(this);
    this.viewportSizeCache = factories.cache.create(this);
    const chain = factories.chain.create();
    map.objects(factories.patron.create(chain.receiveKey('objects')));
    layer.layer(factories.patron.create(chain.receiveKey('layer')));
    stageSize.receiving(factories.patron.create(chain.receiveKey('size')));
    chain.result(factories.patron.create(factories.guest.create(({ layer: konvaLayer, size, objects }: MiniMapChainDocument) => {
      const scale = minimapWidth / size.width;
      const layerSize = {
        width: Math.round(konvaLayer.width() * scale),
        height: Math.round(konvaLayer.height() * scale),
      };
      this.viewportSizeCache.receive(layerSize);
      const miniSize = {
        width: Math.round(size.width * scale),
        height: Math.round(size.height * scale),
      };
      this.theSize.receive(miniSize);
      const points = objects.map((object) => ({
        id: object.id,
        x: Math.round(object.position[0] * scale),
        y: Math.round(object.position[1] * scale),
        width: Math.round(object.width * scale),
        height: Math.round(object.height * scale),
      }));
      localDebug('minimap points', points);
      this.thePoints.receive(points);
    })));
  }

  viewportPosition<R extends GuestType<PointDocument>>(guest: R) {
    const chain = this.factories.chain.create();
    this.stageSize.receiving(this.factories.guestCast.create(guest, chain.receiveKey('size')));
    this.layer.position(this.factories.guestCast.create(guest, chain.receiveKey('position')));
    chain.result(this.factories.guestInTheMiddle.create(guest, ({ size, position }: ViewPortChainDocument) => {
      const scale = minimapWidth / size.width;
      const scaledPosition = {
        x: position.x * scale * -1,
        y: position.y * scale * -1,
      };
      localDebug('scaled position is', scaledPosition);
      guest.receive(scaledPosition);
    }));
    return guest;
  }

  viewportSize<R extends GuestType<SizeDocument>>(guest: R) {
    this.viewportSizeCache.receiving(guest);
    return guest;
  }

  size<R extends GuestType<SizeDocument>>(guest: R) {
    this.theSize.receiving(guest);
    return guest;
  }

  points<R extends GuestType<PointIdDocument[]>>(guest: R) {
    this.thePoints.receiving(guest);
    return guest;
  }
}
