import { MapFileContentType } from '@/modules/application/l1/l2/l3/map/mapFile/MapFileContentType';
import { RuntimeError } from '@/modules/system/error/RuntimeError';
import {
  NotificationType,
} from '@/modules/application/l1/l2/visualisation/notification/NotificationType';
import {
  BrowserLaunchQueueType,
} from '@/modules/integration/browser/launchQueue/BrowserLaunchQueueType';
import { GuestType } from '@/modules/system/guest/GuestType';
import { SystemFileType } from '@/modules/system/file/SystemFileType';
import { BrowserFileType } from '@/modules/integration/browser/file/BrowserFileType';
import { FactoryType } from '@/modules/system/guest/FactoryType';
import { PoolType } from '@/modules/system/guest/PoolType';
import { debug } from 'debug';
import { FileSystemFileHandle } from '@vueuse/core';

const localDebug = debug('FileSystemContent');

export class FileSystemContent implements MapFileContentType {
  private contentPatrons: PoolType<string>;

  private fileHandler: FileSystemFileHandle | null = null;

  public constructor(
    private launchQueue: BrowserLaunchQueueType,
    private notification: NotificationType,
    private factories: {
      fileHandlerContent: FactoryType<SystemFileType>,
      browserFileSaved: FactoryType<BrowserFileType>,
      guest: FactoryType<GuestType>,
      pool: FactoryType<PoolType>,
    },
  ) {
    this.contentPatrons = factories.pool.create(this);
  }

  public content(target: GuestType<string>): this {
    const fileHandlerGuest = this.factories.guest.create((value: FileSystemFileHandle) => {
      this.fileHandler = value;
      this
        .factories.fileHandlerContent
        .create(value)
        .content(this.factories.guest.create((content: string) => {
          this.contentPatrons.distribute(content, target);
        }));
    });

    if (!this.fileHandler) {
      this.launchQueue.fileHandler(fileHandlerGuest);
    } else {
      fileHandlerGuest.receive(this.fileHandler);
    }

    return this;
  }

  public receive(value: string): this {
    localDebug('save file as content string', value);
    if (!this.fileHandler) {
      throw new RuntimeError('Cant save file because no fileHandler');
    }
    try {
      this.factories.browserFileSaved.create(this.fileHandler).save(value);
      this.contentPatrons.receive(value);
      return this;
    } catch (e) {
      throw new RuntimeError('Cant handle receive for map file FS', { cause: e });
    } finally {
      this.notification.receive({
        type: 'success',
        text: 'Успешно сохранен файл карты!',
      });
    }
  }

  public canBeUsed(guest: GuestType<boolean>) {
    const canBeUsed = 'launchQueue' in window;
    localDebug('can be used', canBeUsed);
    const matches = window.matchMedia('(display-mode: standalone)');
    guest.receive(canBeUsed && matches.matches);
    return guest;
  }
}
