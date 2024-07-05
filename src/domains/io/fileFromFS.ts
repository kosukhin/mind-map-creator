import { applicative } from '@/domains/branching/Applicative';

declare global {
  interface Window {
    launchQueue: {
      setConsumer: (launchParams: unknown) => void
    };
  }
}

export const fileFromFS = applicative(() => {
  if ('launchQueue' in window) {
    return new Promise((resolve) => {
      window.launchQueue.setConsumer((launchParams: any) => {
        if (launchParams.files && launchParams.files.length) {
          const [file] = launchParams.files;
          resolve(file);
        } else {
          resolve(null);
        }
      });
    });
  }

  return null;
});
