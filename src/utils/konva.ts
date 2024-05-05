import Konva from 'konva';
import {
  Arrow, KonvaLayerObject, Layer, Stage,
} from '@/entities/Konva';
import { MapObject, MapStructure } from '@/entities/Map';
import { generateUniqString } from '@/utils/string';
import { cloneDeep, omit } from 'lodash';
import { arrowStartPointPosition } from '@/application/arrowStartPointPosition';
import html2canvas from 'html2canvas';

export async function addObjectToLayer(
  layer: Layer,
  object: MapObject,
  map: MapStructure,
  clickLocked = false,
) {
  const { types } = map;
  const type = types[object.type];
  const objectWidth = object.width || type.width;
  const objectHeight = object.height || type.height;

  const rect = new Konva.Rect({
    x: +object.position[0],
    y: +object.position[1],
    image: true,
    width: +objectWidth,
    height: +objectHeight,
    // fill: '#eee',
    name: object.id,
    draggable: !clickLocked,
    objectId: object.id,
  });
  layer.add(rect);

  const arrows: Arrow[] = [];
  if (object.arrows) {
    object.arrows.forEach((toObjectRelation) => {
      const toObject = map.objects[toObjectRelation.id];
      if (!toObject) {
        return;
      }
      const toObjectType = map.types[toObject.type];

      const startPoint = arrowStartPointPosition({
        width: objectWidth,
        height: objectHeight,
      }, {
        x: object.position[0],
        y: object.position[1],
      }, {
        x: toObject.position[0],
        y: toObject.position[1],
      });
      const endPoint = arrowStartPointPosition({
        width: toObject.width || toObjectType.width,
        height: toObject.height || toObjectType.height,
      }, {
        x: toObject.position[0],
        y: toObject.position[1],
      }, {
        x: object.position[0],
        y: object.position[1],
      });

      const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        toObjectId: toObjectRelation.id,
        formObjectId: object.id,
        points: [
          +startPoint.x,
          +startPoint.y,
          +endPoint.x,
          +endPoint.y,
        ],
        pointerLength: 20,
        pointerWidth: 10,
        fill: '#ccc',
        stroke: '#bbb',
        strokeWidth: 2,
      });
      layer.add(arrow);
      arrows.push(arrow);
    });
  }
  return [rect, arrows] as KonvaLayerObject[];
}

export function createLayer(editorWrapper: HTMLElement): [Layer, Stage] {
  const canvasSize = {
    width: editorWrapper.clientWidth,
    height: editorWrapper.clientHeight,
  };
  const stage = new Konva.Stage({
    ...canvasSize,
    container: 'canvas',
    fill: '#eee',
    draggable: true,
  });
  const layer = new Konva.Layer();
  const img = new Image();
  const gridPattern = document.querySelector('.grid-example') as HTMLElement;
  if (gridPattern) {
    html2canvas(gridPattern).then((canvas) => {
      img.src = canvas.toDataURL();
      img.onload = () => {
        const background = new Konva.Rect({
          width: 3000,
          height: 3000,
          x: 0,
          y: 0,
          fillPatternImage: img,
        });
        layer.add(background);
      };
    });
  }
  stage.add(layer);
  layer.draw();
  return [layer, stage];
}

export const removeAllLayerObjects = (layerObjects: Map<string, any>) => {
  Array.from(layerObjects.values()).flat().forEach((objectToRemove: any) => {
    if (Array.isArray(objectToRemove)) {
      objectToRemove.forEach((innerObject: any) => {
        innerObject.remove();
      });
    } else {
      objectToRemove.remove();
    }
  });
  layerObjects.clear();
};

export const removeObjectOnLayer = (
  layerObjects: Map<string, any>,
  object: MapObject,
) => {
  const objects = layerObjects.get(object.id);
  console.log('objects to remove', objects, layerObjects);
  if (!objects) {
    return;
  }
  objects.forEach((objectToRemove: any) => {
    if (Array.isArray(objectToRemove)) {
      objectToRemove.forEach((innerObject: any) => {
        innerObject.remove();
      });
    } else {
      objectToRemove.remove();
    }
  });
};

export const updateObjectOnLayer = async (
  layerObjects: Map<string, any>,
  layer: Layer,
  object: MapObject,
  vMap: MapStructure,
) => {
  removeObjectOnLayer(layerObjects, object);
  const newObjects = await addObjectToLayer(layer, object, vMap);
  layerObjects.set(object.id, newObjects);
};

export async function cloneObject(
  vObj: MapObject,
  vMap: MapStructure,
  vLayer: Layer,
  layerObjects: Map<string, any>,
) {
  const newId = generateUniqString();
  const clonedObject = cloneDeep({ ...omit(vObj, ['arrows']), arrows: [] });
  clonedObject.id = newId;
  vMap.objects[newId] = clonedObject;
  const objects = await addObjectToLayer(vLayer, clonedObject, vMap);
  layerObjects.set(clonedObject.id, objects as KonvaLayerObject[]);
}
