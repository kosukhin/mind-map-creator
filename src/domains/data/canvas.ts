import { applicative } from '@/domains/branching/Applicative';
import { ref } from 'vue';

export const canvas = applicative(ref<HTMLElement>());
