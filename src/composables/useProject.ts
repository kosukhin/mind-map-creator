import { idbRemoveAll } from '@/application/idbRemoveAll';
import { useIdbGetProject } from '@/composables/useIdbGetProject';
import { useIdbSaveProject } from '@/composables/useIdbSaveProject';
import { DEFAULT_PROJECT_NAME } from '@/constants/project';
import { getDirectoryHandler, setDeirectoryHandle, setFiles } from '@/libraries/browser-fs';
import { doLater } from '@/utils/doLater';
import { set } from 'lodash';
import { compose } from 'lodash/fp';
import { ref } from 'vue';

const { getByName } = useIdbGetProject();
const isProjectOpened = ref(false);
const setProjectOff = doLater(set, isProjectOpened, 'value', false);
const loadErrorHandler = compose(idbRemoveAll, setProjectOff);

const loadProjectFiles = () => getByName(DEFAULT_PROJECT_NAME).then((v) => {
  if (v.length) {
    setDeirectoryHandle(v[0].directoryHandle);
    isProjectOpened.value = true;
    return Promise.all(
      v[0].blobs.map(async (blobHandle: any) => {
        const file = (await blobHandle.getFile()) as any;
        file.handle = blobHandle;
        return file;
      }),
    )
      .then(setFiles)
      .catch(loadErrorHandler);
  }
  return v;
});

const saveProjectFiles = async (blobs: any[]) => {
  const project = await getByName(DEFAULT_PROJECT_NAME);
  if (!project.length) {
    isProjectOpened.value = true;
    useIdbSaveProject(
      DEFAULT_PROJECT_NAME,
      blobs.map((blob) => blob.handle),
      getDirectoryHandler(),
    );
  }
};

export const useProject = () => ({
  isProjectOpened,
  loadProjectFiles,
  saveProjectFiles,
  setProjectOff,
});
