import { OptionalAsync } from '@/modules/eo/v2/system/OptionalAsync';

type LaunchParams = {
  files: FileSystemFileHandle[]
}

declare const window: {
  launchQueue: {
    setConsumer: (cb: (launchParams: LaunchParams) => void) => void
  }
};

export class BrowserLaunchQueue {
  public launchParams(): OptionalAsync<LaunchParams | null> {
    return new OptionalAsync(new Promise((resolve) => {
      if ('launchQueue' in window) {
        window.launchQueue.setConsumer((launchParams: LaunchParams) => {
          if (launchParams.files && launchParams.files.length) {
            resolve(launchParams);
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
    }));
  }
}