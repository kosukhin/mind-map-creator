import { tap } from '@/domains/branching/tap';

export const debug = (...messages: any[]) => tap(console.log.bind(console, ...messages));
