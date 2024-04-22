import {
  curry, Lens, lens, prop,
} from 'ramda';

const mutate = curry((propName: string, newValue: any, source: any) => {
  source[propName] = newValue;
  return source[propName];
});

export const lensPropMutate = (propName: string) => lens(prop(propName), mutate(propName)) as Lens<any, any>;
