import { CanvasNull } from '@/modules/application/canvas/CanvasNull';
import { MapNull } from '@/modules/application/map/MapNull';
import { MapFileNull } from '@/modules/application/mapFile/MapFileNull';
import { MapObjectNull } from '@/modules/application/mapObject/MapObjectNull';
import { MapSettingsNull } from '@/modules/application/mapSettings/MapSettingsNull';
import { MapTypeNull } from '@/modules/application/mapType/MapTypeNull';
import { CanvasWhenClickElement } from '@/modules/application/canvas/CanvasWhenClickElement';
import { CanvasFromMap } from '@/modules/application/canvas/CanvasFromMap';
import { MapFileFromURL } from '@/modules/application/mapFile/MapFileFromURL';
import { MapFileFromFS } from '@/modules/application/mapFile/MapFileFromFS';
import { VueRefResult } from '@/modules/integration/vue/VueRefResult';

export const useApplication = () => {
  const map = new MapNull();
  const mapObject = new MapObjectNull();
  const mapType = new MapTypeNull();
  const mapSettings = new MapSettingsNull();
  const mapFile = new MapFileFromURL(new MapFileFromFS(new MapFileNull()));
  const canvas = new CanvasWhenClickElement(
    new CanvasFromMap(new CanvasNull(), map),
  );

  return {
    map: new VueRefResult(mapFile.value()).ref(),
    mapObject: new VueRefResult(mapObject.value()).ref(),
    mapType: new VueRefResult(mapType.value()).ref(),
    mapSettings: new VueRefResult(mapSettings.value()).ref(),
    mapFile: new VueRefResult(mapFile.value()).ref(),
    canvas: new VueRefResult(canvas.value()).ref(),
  };
};
