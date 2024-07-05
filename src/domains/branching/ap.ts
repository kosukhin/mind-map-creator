import { Applicative } from '@/domains/branching/Applicative';

// Первым в функцию попадет значение из applicative, вторым из кобэка в конец rest аргументы
export const ap = (applicative: Applicative, fn: (...args: any[]) => any, ...rest: any[]) => (value: any) => applicative.ap((apValue: any) => fn(apValue, value, ...rest));

// Первым в функцию попадет значение из applicative, последним из кобэка в промежуток rest аргументы
export const apToEnd = (applicative: Applicative, fn: (...args: any[]) => any, ...rest: any[]) => (value: any) => applicative.ap((apValue: any) => fn(apValue, ...rest, value));
