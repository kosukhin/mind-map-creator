import { MapFileOfContent } from '@/modules/application/mapFile/MapFileOfContent';
import { MapFileContentFS } from '@/modules/application/mapFileContent/MapFIleContentFS';
import { MapDocument, MapFileDocument, MapSettingsDocument } from '@/modules/entities/MapStructures';
import { VueRefPatron } from '@/modules/integration/vue/VueRefPatron';
import { BrowserLaunchQueue } from '@/modules/integration/browser/launchQueue/BrowserLaunchQueue';
import { MapCurrent } from '@/modules/application/map/MapCurrent';
import { MapSettingsGuest } from '@/modules/application/mapSettings/MapSettingsGuest';
import { NotificationMemory } from '@/modules/application/notification/NotificationMemory';
import { NotificationDocument } from '@/modules/application/notification/Notification';
import { BrowserCanvas } from '@/modules/integration/browser/canvas/BrowserCanvas';
import { KonvaLayer } from '@/modules/integration/konva/KonvaLayer';
import { MapObjectsVisible } from '@/modules/application/mapObject/MapObjectsVisible';
import { MapObjectsRectsPatron } from '@/modules/application/mapObject/MapObjectsRectsPatron';
import { MapObjectBase } from '@/modules/application/mapObject/MapObjectBase';
import { MiniMap } from '@/modules/application/miniMap/MiniMap';

const notification = new NotificationMemory();
const mapFile = new MapFileOfContent(new MapFileContentFS(new BrowserLaunchQueue(), notification));
const mapCurrent = new MapCurrent(mapFile);
const mapSettings = new MapSettingsGuest(mapFile, mapCurrent);
const canvas = new BrowserCanvas();
const konvaCanvas = new KonvaLayer(mapFile, canvas);
const mapObject = new MapObjectBase(mapCurrent, mapFile);
const mapObjects = new MapObjectsVisible(konvaCanvas, canvas, mapCurrent);
const mapObjectsPatron = new VueRefPatron();
mapObjects.objects(mapObjectsPatron);
mapObjects.objects(new MapObjectsRectsPatron(konvaCanvas, mapObject));

const mapSettingsPatron = new VueRefPatron<MapSettingsDocument>();
mapCurrent.mapSettings(mapSettingsPatron);

const mapPatron = new VueRefPatron<MapDocument>();
mapFile.currentMap(mapPatron);

const mapFilePatron = new VueRefPatron<MapFileDocument>();
mapFile.mapFile(mapFilePatron);

const notificationPatron = new VueRefPatron<NotificationDocument>();
notification.message(notificationPatron);

const miniMap = new MiniMap(mapCurrent, konvaCanvas);

export const useApplication = () => ({
  map: mapPatron.ref(),
  mapBehaviour: mapCurrent,
  mapFile: mapFilePatron.ref(),
  mapSettings: mapSettingsPatron.ref(),
  mapObjects: mapObjectsPatron.ref(),
  mapSettingsGuest: mapSettings,
  canvasGuest: canvas,
  notification: notificationPatron.ref(),
  miniMapBehaviour: miniMap,
});
