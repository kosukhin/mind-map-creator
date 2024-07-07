import { ref } from 'vue';
import { applicative } from '@/domains/branching/Applicative';
import { createValueApplicative } from '@/domains/application/createValueApplicative';

export const mapFileHandler = applicative(ref<FileSystemFileHandle | null>(null));
export const mapFileHandlerValue = applicative(
  () => createValueApplicative(mapFileHandler).value(),
);
