import { addFiles, getDirectoryHandler, updateBlobContent } from '@/libraries/browser-fs';
import { useRouter } from 'vue-router';
import { useIdbGetProject } from '@/composables/useIdbGetProject';
import { DEFAULT_PROJECT_NAME } from '@/constants/project';
import { useIdbSaveProject } from '@/composables/useIdbSaveProject';
import { createMap as newMap } from '@/utils/map';

const { getByName } = useIdbGetProject();

// FIXME Убрать в функции
export function useRequestCreateMap() {
  const createMap = async (mapName: string, withPush = true): Promise<void> => {
    const directoryHandler = getDirectoryHandler();

    if (directoryHandler && mapName) {
      const map = newMap('', mapName);

      const fileHandle = await directoryHandler.getFileHandle(
        `${map.document}.json`,
        {
          create: true,
        },
      ) as any;
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(map));
      await writable.close();
      const file: any = await fileHandle.getFile();
      file.handle = fileHandle;
      addFiles([file]);
      updateBlobContent(file, JSON.stringify(map));

      getByName(DEFAULT_PROJECT_NAME).then((v: any) => {
        if (v[0]) {
          useIdbSaveProject(
            DEFAULT_PROJECT_NAME,
            [...v[0].blobs, fileHandle],
            getDirectoryHandler(),
            v[0].id,
          );
        }
      });

      if (withPush) {
        useRouter().push(`/${map.url}`);
      }
    }
  };

  return {
    createMap,
  };
}
