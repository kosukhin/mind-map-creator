import { MapObjectDocument } from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { GuestAwareType } from '@/modules/system/guest/GuestAwareType';
import { PointDocument } from '@/modules/application/l1/l2/l3/map/documents/PointDocument';
import { FactoryType } from '@/modules/system/guest/FactoryType';
import { CacheType } from '@/modules/system/guest/CacheType';
import { GuestType } from '@/modules/system/guest/GuestType';
import { removePatronFromPools } from '@/modules/system/guest/PatronPool';
import { LayerBase } from '@/modules/application/l1/l2/l3/types/LayerBase';
import { Layer as KonvaLayer } from 'konva/lib/Layer';
import { ArrowPathType } from '@/modules/application/l1/l2/l3/l4/types/arrow/ArrowPathType';
import { Arrow } from 'konva/lib/shapes/Arrow';
import { debug } from 'debug';

const localDebug = debug('NewArrow');

const arrowGeometry = {
  width: 10,
  height: 10,
};

/**
 * Новая стрелка, появляется при создании новой связи
 */
export class NewArrow {
  private cursorGuest: CacheType<GuestType>;

  private arrowCache: CacheType;

  public constructor(
    private konvaLayer: LayerBase,
    private cursorPosition: GuestAwareType<PointDocument>,
    private arrowPath: ArrowPathType,
    private factories: {
      cache: FactoryType<CacheType>,
      patron: FactoryType<GuestType>,
      guest: FactoryType<GuestType>,
    },
  ) {
    this.cursorGuest = this.factories.cache.create(this);
    this.arrowCache = this.factories.cache.create(this);
  }

  /**
   * Создать новую стрелку для объекта
   */
  public forObject(object: MapObjectDocument) {
    localDebug('start watch cursor');
    this.cursorGuest.receiving(
      this.factories.guest.create((guest: GuestType) => {
        removePatronFromPools(guest);
      }),
    );

    let arrow: Arrow | null = null;
    const patron = this.factories.patron.create(
      this.factories.guest.create((cursorPosition: PointDocument) => {
        localDebug('cursor moves');
        this.konvaLayer.layer(
          this.factories.guest.create((layer: KonvaLayer) => {
            localDebug('cursor moves in layer');
            // TODO сделать отрисовку стрелки
            this.arrowPath.breakPoints(
              {
                shapeGeometry: {
                  width: object.width,
                  height: object.height,
                },
                shapePosition: {
                  x: object.position[0],
                  y: object.position[1],
                },
                lookToGeometry: arrowGeometry,
                lookToPosition: cursorPosition,
              },
              {
                lookToGeometry: {
                  width: object.width,
                  height: object.height,
                },
                lookToPosition: {
                  x: object.position[0],
                  y: object.position[1],
                },
                shapeGeometry: arrowGeometry,
                shapePosition: cursorPosition,
              },
              this.factories.guest.create((points: number[]) => {
                if (arrow) {
                  arrow.points(points);
                  return;
                }
                arrow = new Arrow({
                  x: 0,
                  y: 0,
                  points,
                  pointerLength: 20,
                  pointerWidth: 10,
                  fill: '#ccc',
                  stroke: '#bbb',
                  strokeWidth: 2,
                  zIndex: 2,
                });
                layer.add(arrow);
                this.arrowCache.receive(arrow);
              }),
            );
          }),
        );
        this.arrowPath.clear();
      }),
    );
    this.cursorPosition.receiving(patron);
    this.cursorGuest.receive(patron);
  }

  /**
   * Отмена стрелки
   */
  public dispose() {
    this.cursorGuest.receiving(
      this.factories.guest.create((guest: GuestType) => {
        removePatronFromPools(guest);
      }),
    );
    this.arrowCache.receiving(
      this.factories.guest.create((arrow: Arrow) => {
        arrow.remove();
      }),
    );
  }
}
