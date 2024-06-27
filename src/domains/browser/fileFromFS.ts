import { None } from '@/domains/branching/Maybe';

declare global {
  interface Window {
    launchQueue: {
      setConsumer: (launchParams: unknown) => void
    };
  }
}

export const fileFromFS = () => {
  if ('launchQueue' in window) {
    return new Promise((resolve) => {
      window.launchQueue.setConsumer((launchParams: any) => {
        if (launchParams.files && launchParams.files.length) {
          const [file] = launchParams.files;
          resolve(file);
        } else {
          resolve(new None());
        }
      });
    });
  }

  return new None();
};
