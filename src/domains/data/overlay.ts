import { applicative } from '@/domains/branching/Applicative';
import { ref } from 'vue';

export const overlayName = applicative(ref<string>());
export const overlayNameToClose = applicative(ref<string>());
