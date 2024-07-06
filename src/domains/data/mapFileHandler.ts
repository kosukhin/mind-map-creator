import { ref } from 'vue';
import { applicative } from '@/domains/branching/Applicative';

export const mapFileHandler = applicative(ref<FileSystemFileHandle | null>(null));
