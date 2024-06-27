import { readFile } from '@/libraries/browser-fs';

export const readFileHandler = (fileHandler: FileSystemFileHandle) => new Promise((resolve, reject) => {
  fileHandler.getFile().then(async (file) => {
    (file as any).handle = fileHandler;
    return readFile(file).then((fileContent) => {
      resolve(String(fileContent));
    }).catch(reject);
  }).catch(reject);
});
