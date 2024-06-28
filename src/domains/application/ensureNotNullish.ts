import { None } from '@/domains/branching/Maybe';

export const ensureNotNullish = (value: unknown) => (value === null || value === undefined ? new None() : value);
