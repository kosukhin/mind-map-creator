import { applicative } from '@/domains/branching/Applicative';
import { tap } from '@/domains/branching/tap';

const initializatorsMap = new Map();

export const createApplicativeWithInitializator = (
  dependency: any,
  initializator: (dep: any) => any,
) => applicative(dependency).ap(tap(() => {
  if (!initializatorsMap.has(dependency)) {
    initializatorsMap.set(dependency, 1);
    initializator(dependency);
  }
}));
