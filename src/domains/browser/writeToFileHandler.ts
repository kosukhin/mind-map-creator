import { MapFile } from '@/entities/Map';

export const writeToFileHandler = (fileHandler: FileSystemFileHandle, fileContent: MapFile) => fileHandler.createWritable()
  .then(
    (writable) => writable.write(JSON.stringify(fileContent))
      .then(() => writable.close()),
  );
